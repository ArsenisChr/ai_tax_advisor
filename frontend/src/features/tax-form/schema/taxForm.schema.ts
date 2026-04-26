import { z } from 'zod'

export const MARITAL_STATUS = ['single', 'married'] as const

export const EMPLOYMENT_CATEGORY = [
  'employee',
  'freelancer',
  'rental_income',
  'business_owner',
  'farmer',
  'income_earner',
  'unemployed',
  'retired',
  'other',
] as const

export const TAX_RESIDENCY = [
  'GR',
  'CY',
  'DE',
  'GB',
  'FR',
  'IT',
  'ES',
  'NL',
  'BE',
  'AT',
  'US',
  'OTHER',
] as const

export const taxFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name (at least 2 characters).')
    .max(80, 'Name is too long.'),

  age: z.coerce
    .number({ message: 'Please enter a valid number.' })
    .int('Age must be a whole number.')
    .min(18, 'You must be at least 18 years old.')
    .max(120, 'Please enter a realistic age.'),

  taxResidency: z.enum(TAX_RESIDENCY, {
    message: 'Please select a country of tax residency.',
  }),

  maritalStatus: z.enum(MARITAL_STATUS, {
    message: 'Please select a marital status.',
  }),

  employmentCategory: z.enum(EMPLOYMENT_CATEGORY, {
    message: 'Please select an employment category.',
  }),

  annualIncome: z.coerce
    .number({ message: 'Please enter a valid number.' })
    .nonnegative('Income cannot be negative.')
    .max(10_000_000, 'Please enter a realistic value.'),

  deductibleExpenses: z.coerce
    .number({ message: 'Please enter a valid number.' })
    .nonnegative('Expenses cannot be negative.')
    .max(10_000_000, 'Please enter a realistic value.'),

  dependentChildren: z.coerce
    .number({ message: 'Please enter a valid number.' })
    .int('Must be a whole number.')
    .min(0, 'Cannot be negative.')
    .max(20, 'Please enter a realistic value.'),

  notes: z
    .string()
    .trim()
    .max(500, 'Notes must be 500 characters or less.')
    .optional()
    .or(z.literal('')),
})

export type TaxFormInput = z.input<typeof taxFormSchema>
export type TaxFormValues = z.output<typeof taxFormSchema>

export const defaultTaxFormValues: TaxFormInput = {
  fullName: '',
  age: 18,
  taxResidency: 'GR',
  maritalStatus: 'single',
  employmentCategory: 'employee',
  annualIncome: 0,
  deductibleExpenses: 0,
  dependentChildren: 0,
  notes: '',
}

export const maritalStatusLabels: Record<
  (typeof MARITAL_STATUS)[number],
  string
> = {
  single: 'Single',
  married: 'Married',
}

export const employmentCategoryLabels: Record<
  (typeof EMPLOYMENT_CATEGORY)[number],
  string
> = {
  employee: 'Employee (salaried)',
  freelancer: 'Freelancer / self-employed',
  rental_income: 'Rental income',
  business_owner: 'Business owner',
  farmer: 'Farmer',
  income_earner: 'Income earner',
  unemployed: 'Unemployed',
  retired: 'Retired',
  other: 'Other',
}

export const taxResidencyLabels: Record<
  (typeof TAX_RESIDENCY)[number],
  string
> = {
  GR: 'Greece',
  CY: 'Cyprus',
  DE: 'Germany',
  GB: 'United Kingdom',
  FR: 'France',
  IT: 'Italy',
  ES: 'Spain',
  NL: 'Netherlands',
  BE: 'Belgium',
  AT: 'Austria',
  US: 'United States',
  OTHER: 'Other',
}
