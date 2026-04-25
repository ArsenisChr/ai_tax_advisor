"""Unit tests for `app.services.tax_advice` (OpenAI path mocked; no real API)."""

from __future__ import annotations

import pytest
from app.schemas.tax_form import TaxAdviceRequest
from app.services import tax_advice
from app.services.prompts import TAX_ADVICE_SYSTEM_PROMPT, build_tax_user_prompt
from app.services.tax_advice import _OPENAI_502, generate_tax_advice
from fastapi import HTTPException
from openai import OpenAIError


def _valid_request() -> TaxAdviceRequest:
    return TaxAdviceRequest.model_validate(
        {
            "fullName": "Test User",
            "age": 40,
            "taxResidency": "GR",
            "maritalStatus": "single",
            "employmentCategory": "employee",
            "annualIncome": 35_000,
            "deductibleExpenses": 2_000,
            "dependentChildren": 0,
            "notes": None,
        }
    )


@pytest.mark.asyncio
async def test_generate_tax_advice_returns_message_from_model(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    want = "Keep receipts for deductible expenses. This is not legal advice."
    user_prompt_sent: dict[str, str] = {}

    async def _fake(
        *, system_prompt: str, user_message: str
    ) -> str:
        user_prompt_sent["system"] = system_prompt
        user_prompt_sent["user"] = user_message
        return want

    monkeypatch.setattr(tax_advice, "generate_text", _fake)

    request = _valid_request()
    out = await generate_tax_advice(request)

    assert out.message == want
    assert out.status == "received"
    assert user_prompt_sent["system"] == TAX_ADVICE_SYSTEM_PROMPT
    assert user_prompt_sent["user"] == build_tax_user_prompt(request)


@pytest.mark.asyncio
async def test_generate_tax_advice_value_error_becomes_502(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    async def _empty(*, system_prompt: str, user_message: str) -> str:
        raise ValueError("OpenAI returned an empty response.")

    monkeypatch.setattr(tax_advice, "generate_text", _empty)

    with pytest.raises(HTTPException) as exc_info:
        await generate_tax_advice(_valid_request())

    assert exc_info.value.status_code == 502
    assert exc_info.value.detail == _OPENAI_502


@pytest.mark.asyncio
async def test_generate_tax_advice_openai_error_becomes_502(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    async def _boom(*, system_prompt: str, user_message: str) -> str:
        raise OpenAIError("API down")

    monkeypatch.setattr(tax_advice, "generate_text", _boom)

    with pytest.raises(HTTPException) as exc_info:
        await generate_tax_advice(_valid_request())

    assert exc_info.value.status_code == 502
    assert exc_info.value.detail == _OPENAI_502
