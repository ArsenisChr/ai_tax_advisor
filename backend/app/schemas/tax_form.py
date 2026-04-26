"""Pydantic DTOs for tax advice requests and responses.

Wire format uses camelCase to match the frontend Zod schema.
Python code uses snake_case (PEP 8). Pydantic translates via `alias_generator`.
"""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic.alias_generators import to_camel

# Enum values mirror frontend/src/features/tax-form/schema/taxForm.schema.ts
MaritalStatus = Literal["single", "married"]

EmploymentCategory = Literal[
    "employee",
    "freelancer",
    "rental_income",
    "business_owner",
    "farmer",
    "income_earner",
    "unemployed",
    "retired",
    "other",
]

TaxResidency = Literal["GR", "CY", "DE", "GB", "FR", "IT", "ES", "NL", "BE", "AT", "US", "OTHER"]


class _CamelModel(BaseModel):
    """Base class: Python fields are snake_case, JSON fields are camelCase."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        str_strip_whitespace=True,
    )


class TaxAdviceRequest(_CamelModel):
    """Incoming tax form submission."""

    full_name: str = Field(min_length=2, max_length=80)
    age: int = Field(ge=18, le=120)
    tax_residency: TaxResidency
    marital_status: MaritalStatus
    employment_category: EmploymentCategory
    annual_income: float = Field(ge=0, le=10_000_000)
    deductible_expenses: float = Field(ge=0, le=10_000_000)
    dependent_children: int = Field(ge=0, le=20)
    notes: str | None = Field(default=None, max_length=500)

    @field_validator("notes", mode="before")
    @classmethod
    def _empty_notes_to_none(cls, v: object) -> object:
        """Treat empty strings as None."""
        if isinstance(v, str) and not v.strip():
            return None
        return v


class TaxAdviceResponse(_CamelModel):
    """Acknowledgement that the submission was accepted."""

    status: Literal["received"] = "received"
    message: str
    received_at: datetime
