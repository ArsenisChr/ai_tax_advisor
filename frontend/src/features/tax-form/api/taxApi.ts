import type { TaxFormValues } from '../schema/taxForm.schema'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type TaxAdviceResponse = {
  status: 'received'
  message: string
  receivedAt: string
}

export type ValidationIssue = {
  loc: (string | number)[]
  msg: string
  type: string
}

export class ApiError extends Error {
  readonly status: number
  readonly issues: ValidationIssue[]

  constructor(message: string, status: number, issues: ValidationIssue[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.issues = issues
  }
}

export async function submitTaxAdvice(
  values: TaxFormValues,
): Promise<TaxAdviceResponse> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}/api/tax/advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
  } catch {
    throw new ApiError(
      'Could not reach the server. Please check your connection and try again.',
      0,
    )
  }

  if (!response.ok) {
    const detail = await safeJson(response)
    const issues = extractIssues(detail)
    const message =
      response.status === 422
        ? 'Some fields are invalid. Please review and try again.'
        : 'The server could not process your submission. Please try again later.'
    throw new ApiError(message, response.status, issues)
  }

  return (await response.json()) as TaxAdviceResponse
}

async function safeJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function extractIssues(payload: unknown): ValidationIssue[] {
  if (
    payload &&
    typeof payload === 'object' &&
    'detail' in payload &&
    Array.isArray((payload as { detail: unknown }).detail)
  ) {
    return (payload as { detail: ValidationIssue[] }).detail
  }
  return []
}
