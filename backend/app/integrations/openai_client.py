from __future__ import annotations

from openai import AsyncOpenAI

from app.core.config import get_settings

_client: AsyncOpenAI | None = None


def get_openai_client() -> AsyncOpenAI:
    global _client

    if _client is None:
        settings = get_settings()
        _client = AsyncOpenAI(
            api_key=settings.openai_api_key.get_secret_value(),
            timeout=60.0,
        )

    return _client


async def generate_text(
    *,
    system_prompt: str,
    user_message: str,
) -> str:
    settings = get_settings()
    client = get_openai_client()

    response = await client.responses.create(
        model=settings.openai_model,
        instructions=system_prompt,
        input=user_message,
        temperature=0.2,
    )

    text = response.output_text

    if not text or not text.strip():
        raise ValueError("OpenAI returned an empty response.")

    return text.strip()
