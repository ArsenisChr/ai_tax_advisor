"""Business logic for tax advice submissions."""

from __future__ import annotations

from datetime import UTC, datetime

from app.core.config import get_settings
from app.core.logging import get_logger
from app.integrations.openai_client import generate_text
from app.schemas.tax_form import TaxAdviceRequest, TaxAdviceResponse
from app.services.prompts import TAX_ADVICE_SYSTEM_PROMPT, build_tax_user_prompt
from fastapi import HTTPException
from openai import OpenAIError

log = get_logger(__name__)
_OPENAI_502 = "OpenAI API service is not available"

async def generate_tax_advice(request: TaxAdviceRequest) -> TaxAdviceResponse:
    """Process a tax form submission and return a response."""
    log.info(
        "tax_advice_requested",
        age=request.age,
        full_name=request.full_name,
        employment_category=request.employment_category,
        tax_residency=request.tax_residency,
        marital_status=request.marital_status,
        dependent_children=request.dependent_children,
        annual_income=request.annual_income,
        deductible_expenses=request.deductible_expenses,
        has_notes=request.notes is not None,
    )

    user_input = build_tax_user_prompt(request)
    settings = get_settings()

    try:
        advice = await generate_text(
            system_prompt=TAX_ADVICE_SYSTEM_PROMPT,
            user_message=user_input,
        )
    except ValueError as exc:
        log.warning("openai_empty_response", model=settings.openai_model, error=str(exc))
        raise HTTPException(status_code=502, detail=_OPENAI_502) from exc
    except OpenAIError as exc:
        log.exception("openai_request_failed", model=settings.openai_model)
        raise HTTPException(status_code=502, detail=_OPENAI_502) from exc

    return TaxAdviceResponse(message=advice, received_at=datetime.now(UTC))
