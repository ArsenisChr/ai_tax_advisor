"""FastAPI application entrypoint.

The `create_app()` factory pattern makes the app easier to test: each test
can instantiate a fresh app with overridden settings instead of importing
a module-level global.
"""

from __future__ import annotations

from asgi_correlation_id import CorrelationIdMiddleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.tax import router as tax_router
from app.core.config import get_settings
from app.core.logging import configure_logging, get_logger


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings)

    app = FastAPI(
        title="AI Tax Advisor API",
        description="REST API for the AI Tax Advisor application.",
        version="0.1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(CorrelationIdMiddleware)

    app.include_router(health_router)
    app.include_router(tax_router, prefix=settings.api_prefix)
    log = get_logger(__name__)
    log.info("app_started", env=settings.app_env, log_level=settings.log_level)

    return app


app = create_app()
