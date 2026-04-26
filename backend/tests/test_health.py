"""Integration tests for health + readiness probes."""

from __future__ import annotations

from uuid import UUID

from fastapi.testclient import TestClient


def test_health_returns_ok(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_ready_returns_ready(client: TestClient) -> None:
    response = client.get("/ready")

    assert response.status_code == 200
    assert response.json() == {"status": "ready"}


def test_request_id_header_is_generated(client: TestClient) -> None:
    response = client.get("/health")

    request_id = response.headers.get("x-request-id")
    assert request_id is not None
    UUID(request_id)


def test_request_id_header_is_propagated(client: TestClient) -> None:
    custom_id = "00000000-0000-4000-8000-000000000001"

    response = client.get("/health", headers={"X-Request-ID": custom_id})

    assert response.headers["x-request-id"] == custom_id
