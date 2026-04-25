from app.schemas.tax_form import TaxAdviceRequest


TAX_ADVICE_SYSTEM_PROMPT = """
You are an AI tax advisor assistant.

Rules:
- Provide general guidance only
- Do not give legal or financial guarantees
- If information is insufficient, say so
- Always include a short disclaimer

Style:
- Clear
- Concise
- Structured in bullet points

Formatting:
- Use GitHub-flavored Markdown
- Use bullet points
- Use headings
- Highlight key points with bold text
"""


def build_tax_user_prompt(request: TaxAdviceRequest) -> str:
    return f"""
User tax information:

Tax residency: {request.tax_residency}
Marital status: {request.marital_status}
Dependent children: {request.dependent_children}
Age: {request.age}
Employment category: {request.employment_category}
Annual income: {request.annual_income}
Deductible expenses: {request.deductible_expenses}
{f"Notes: {request.notes}" if request.notes else ""}

Provide helpful tax advice based on this data.
"""