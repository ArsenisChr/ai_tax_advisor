"""Shared pytest fixtures."""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from app.core.config import get_settings
from app.main import create_app
from fastapi.testclient import TestClient


@pytest.fixture(scope="session", autouse=True)
def _clear_settings_cache() -> Iterator[None]:
    """Ensure tests don't carry a stale cached Settings from a prior run."""
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


@pytest.fixture
def client() -> Iterator[TestClient]:
    """A fresh app + TestClient per test — keeps tests isolated."""
    app = create_app()
    with TestClient(app) as test_client:
        yield test_client
