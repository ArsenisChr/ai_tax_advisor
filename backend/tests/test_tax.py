"""Tests for the tax advice feature — schema validation + endpoint behavior."""

from __future__ import annotations

from datetime import datetime
from typing import Any

import pytest
from app.schemas.tax_form import TaxAdviceRequest
from app.services import tax_advice
from app.services.tax_advice import _OPENAI_502
from fastapi.testclient import TestClient
from openai import OpenAIError

ENDPOINT = "/api/tax/advice"
MOCK_MESSAGE = "Simulated tax advice for automated tests."


# ---------------------------------------------------------------------------
# Shared fixtures
# ---------------------------------------------------------------------------


@pytest.fixture(autouse=True)
def _mock_openai_generate_text(monkeypatch: pytest.MonkeyPatch) -> None:
    """Never call the real OpenAI API from HTTP tests."""

    async def _success(*, system_prompt: str, user_message: str) -> str:
        return MOCK_MESSAGE

    monkeypatch.setattr(tax_advice, "generate_text", _success)


@pytest.fixture
def valid_payload() -> dict[str, Any]:
    """Minimal but complete submission matching the frontend contract."""
    return {
        "fullName": "Maria Papadopoulou",
        "age": 42,
        "taxResidency": "GR",
        "maritalStatus": "married",
        "employmentCategory": "freelancer",
        "annualIncome": 45000,
        "deductibleExpenses": 8000,
        "dependentChildren": 1,
        "notes": "Switched from employee to freelancer mid-year",
    }


# ---------------------------------------------------------------------------
# Unit tests: schema
# ---------------------------------------------------------------------------


@pytest.mark.parametrize("empty_value", ["", "   ", "\n\t"])
def test_blank_notes_are_normalized_to_none(
    valid_payload: dict[str, Any], empty_value: str
) -> None:
    request = TaxAdviceRequest.model_validate({**valid_payload, "notes": empty_value})

    assert request.notes is None


# ---------------------------------------------------------------------------
# Integration tests: endpoint
# ---------------------------------------------------------------------------


def test_submit_returns_200_receipt(client: TestClient, valid_payload: dict[str, Any]) -> None:
    response = client.post(ENDPOINT, json=valid_payload)

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "received"
    assert body["message"] == MOCK_MESSAGE
    datetime.fromisoformat(body["receivedAt"])


def test_response_uses_camel_case(client: TestClient, valid_payload: dict[str, Any]) -> None:
    response = client.post(ENDPOINT, json=valid_payload)

    body = response.json()
    assert "receivedAt" in body
    assert "received_at" not in body


def test_missing_required_field_returns_422(
    client: TestClient, valid_payload: dict[str, Any]
) -> None:
    del valid_payload["fullName"]

    response = client.post(ENDPOINT, json=valid_payload)

    assert response.status_code == 422
    errors = response.json()["detail"]
    assert any(err["loc"][-1] == "fullName" for err in errors)


def test_out_of_range_age_returns_422(client: TestClient, valid_payload: dict[str, Any]) -> None:
    response = client.post(ENDPOINT, json={**valid_payload, "age": 10})

    assert response.status_code == 422


def test_invalid_enum_returns_422(client: TestClient, valid_payload: dict[str, Any]) -> None:
    response = client.post(ENDPOINT, json={**valid_payload, "employmentCategory": "astronaut"})

    assert response.status_code == 422


def test_openai_error_returns_502(
    client: TestClient, valid_payload: dict[str, Any], monkeypatch: pytest.MonkeyPatch
) -> None:
    async def _fail(*, system_prompt: str, user_message: str) -> str:
        raise OpenAIError("unavailable for test")

    monkeypatch.setattr(tax_advice, "generate_text", _fail)

    response = client.post(ENDPOINT, json=valid_payload)

    assert response.status_code == 502
    assert response.json()["detail"] == _OPENAI_502


def test_openai_empty_response_returns_502(
    client: TestClient, valid_payload: dict[str, Any], monkeypatch: pytest.MonkeyPatch
) -> None:
    async def _value_error(*, system_prompt: str, user_message: str) -> str:
        raise ValueError("empty")

    monkeypatch.setattr(tax_advice, "generate_text", _value_error)

    response = client.post(ENDPOINT, json=valid_payload)

    assert response.status_code == 502
    assert response.json()["detail"] == _OPENAI_502
