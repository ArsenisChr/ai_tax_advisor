"""Application configuration loaded from environment variables.

All settings are typed, validated at startup, and accessed via `get_settings()`.
Never read env vars directly with `os.getenv(...)` — always go through this module.
"""

from functools import lru_cache
from typing import Literal

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

Environment = Literal["local", "test", "staging", "production"]


class Settings(BaseSettings):
    """Typed application settings.

    Values are loaded (in priority order) from:
        1. Process environment variables (e.g. `APP_LOG_LEVEL=DEBUG`)
        2. `.env` file in the backend/ directory (local dev only)
        3. Defaults declared below
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="APP_",
        case_sensitive=False,
        extra="ignore",
    )

    app_env: Environment = "local"
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"

    api_prefix: str = "/api"
    cors_origins: list[str] = Field(default_factory=list)

    openai_api_key: SecretStr
    openai_model: str = "gpt-4.1"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached singleton `Settings` instance.

    Cached so the `.env` file and env vars are parsed only once per process.
    Tests can override via `get_settings.cache_clear()` + monkeypatching env vars.
    """
    return Settings()
