"""Business logic for tax advice submissions."""

from __future__ import annotations

from datetime import UTC, datetime

from app.core.logging import get_logger
from app.schemas.tax_form import TaxAdviceRequest, TaxAdviceResponse

log = get_logger(__name__)


async def generate_tax_advice(request: TaxAdviceRequest) -> TaxAdviceResponse:
    """Process a tax form submission and return a response."""
    log.info(
        "tax_advice_requested",
        employment_category=request.employment_category,
        tax_residency=request.tax_residency,
        marital_status=request.marital_status,
        dependent_children=request.dependent_children,
        has_notes=request.notes is not None,
    )
    return TaxAdviceResponse(
        message="Your tax information was received successfully.",
        received_at=datetime.now(UTC),
    )
