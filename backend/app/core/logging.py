"""Structured logging via structlog.

Console output in local, JSON everywhere else. The `request_id` bound by
`asgi-correlation-id` middleware is automatically injected in every log.
"""

from __future__ import annotations

import logging
from typing import cast

import structlog
from asgi_correlation_id.context import correlation_id
from structlog.typing import EventDict, WrappedLogger

from app.core.config import Settings


def _add_correlation_id(_: WrappedLogger, __: str, event_dict: EventDict) -> EventDict:
    """Inject the current asgi-correlation-id into every log event, if any."""
    if cid := correlation_id.get(None):
        event_dict["request_id"] = cid
    return event_dict


def configure_logging(settings: Settings) -> None:
    renderer = (
        structlog.dev.ConsoleRenderer(colors=True)
        if settings.app_env == "local"
        else structlog.processors.JSONRenderer()
    )

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            _add_correlation_id,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso", utc=True),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            renderer,
        ],
        wrapper_class=structlog.make_filtering_bound_logger(
            logging.getLevelNamesMapping()[settings.log_level]
        ),
        cache_logger_on_first_use=True,
    )


def get_logger(name: str | None = None) -> structlog.stdlib.BoundLogger:
    return cast("structlog.stdlib.BoundLogger", structlog.get_logger(name))
