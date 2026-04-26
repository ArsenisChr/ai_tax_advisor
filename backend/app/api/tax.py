"""HTTP routes for tax advice submissions."""

from __future__ import annotations

from fastapi import APIRouter, status

from app.schemas.tax_form import TaxAdviceRequest, TaxAdviceResponse
from app.services.tax_advice import generate_tax_advice

router = APIRouter(prefix="/tax", tags=["tax"])


@router.post(
    "/advice",
    response_model=TaxAdviceResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit tax form and receive advice",
)
async def submit_tax_advice(payload: TaxAdviceRequest) -> TaxAdviceResponse:
    return await generate_tax_advice(payload)
