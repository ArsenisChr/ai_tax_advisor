import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  EMPLOYMENT_CATEGORY,
  MARITAL_STATUS,
  TAX_RESIDENCY,
  defaultTaxFormValues,
  employmentCategoryLabels,
  maritalStatusLabels,
  taxFormSchema,
  taxResidencyLabels,
  type TaxFormInput,
  type TaxFormValues,
} from '../schema/taxForm.schema'
import { ApiError, submitTaxAdvice } from '../api/taxApi'
import { useSessionStorage } from '@/lib/useSessionStorage'
import { FormField } from './FormField'
import { describedBy } from './describedBy'
import { TaxSummary } from './TaxSummary'
import styles from './TaxForm.module.css'

type SavedSubmission = {
  data: TaxFormValues
  savedAt: string
}

export function TaxForm() {
  const [saved, setSaved] = useSessionStorage<SavedSubmission | null>(
    'tax-form-submission',
    null,
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaxFormInput, unknown, TaxFormValues>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: saved?.data ?? defaultTaxFormValues,
    mode: 'onTouched',
  })

  const onSubmit = async (values: TaxFormValues) => {
    setSubmitError(null)
    try {
      const response = await submitTaxAdvice(values)
      setSaved({ data: values, savedAt: response.receivedAt })
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Something went wrong. Please try again.'
      setSubmitError(message)
    }
  }

  const handleReset = () => {
    reset(defaultTaxFormValues)
    setSaved(null)
    setSubmitError(null)
  }

  return (
    <div className={styles.wrapper}>
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-describedby="form-intro"
      >
        <p id="form-intro" className={styles.intro}>
          Fill in the fields below. All monetary values are in euros (€).
          Required fields are marked with <span aria-hidden="true">*</span>.
        </p>

        {submitError && (
          <div className={styles.errorBanner} role="alert">
            {submitError}
          </div>
        )}

        <div className={styles.grid}>
          <FormField
            id="fullName"
            label="Full name"
            required
            error={errors.fullName?.message}
          >
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="George Papadopoulos"
              aria-invalid={errors.fullName ? 'true' : 'false'}
              aria-describedby={describedBy(
                'fullName',
                undefined,
                errors.fullName?.message,
              )}
              {...register('fullName')}
            />
          </FormField>

          <FormField
            id="age"
            label="Age"
            required
            hint="Must be 18 or older."
            error={errors.age?.message}
          >
            <input
              id="age"
              type="number"
              inputMode="numeric"
              min={18}
              max={120}
              step={1}
              placeholder="35"
              aria-invalid={errors.age ? 'true' : 'false'}
              aria-describedby={describedBy(
                'age',
                'Must be 18 or older.',
                errors.age?.message,
              )}
              {...register('age')}
            />
          </FormField>

          <FormField
            id="taxResidency"
            label="Country of tax residency"
            required
            hint="The country where you pay income tax."
            error={errors.taxResidency?.message}
          >
            <select
              id="taxResidency"
              autoComplete="country"
              aria-invalid={errors.taxResidency ? 'true' : 'false'}
              aria-describedby={describedBy(
                'taxResidency',
                'The country where you pay income tax.',
                errors.taxResidency?.message,
              )}
              {...register('taxResidency')}
            >
              {TAX_RESIDENCY.map((code) => (
                <option key={code} value={code}>
                  {taxResidencyLabels[code]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="maritalStatus"
            label="Marital status"
            required
            error={errors.maritalStatus?.message}
          >
            <select
              id="maritalStatus"
              aria-invalid={errors.maritalStatus ? 'true' : 'false'}
              aria-describedby={describedBy(
                'maritalStatus',
                undefined,
                errors.maritalStatus?.message,
              )}
              {...register('maritalStatus')}
            >
              {MARITAL_STATUS.map((status) => (
                <option key={status} value={status}>
                  {maritalStatusLabels[status]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="employmentCategory"
            label="Employment category"
            required
            hint="Your main source of income for Greek tax purposes."
            error={errors.employmentCategory?.message}
          >
            <select
              id="employmentCategory"
              aria-invalid={errors.employmentCategory ? 'true' : 'false'}
              aria-describedby={describedBy(
                'employmentCategory',
                'Your main source of income for Greek tax purposes.',
                errors.employmentCategory?.message,
              )}
              {...register('employmentCategory')}
            >
              {EMPLOYMENT_CATEGORY.map((category) => (
                <option key={category} value={category}>
                  {employmentCategoryLabels[category]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            id="dependentChildren"
            label="Dependent children"
            required
            hint="Children that are tax-dependent on you."
            error={errors.dependentChildren?.message}
          >
            <input
              id="dependentChildren"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              placeholder="0"
              aria-invalid={errors.dependentChildren ? 'true' : 'false'}
              aria-describedby={describedBy(
                'dependentChildren',
                'Children that are tax-dependent on you.',
                errors.dependentChildren?.message,
              )}
              {...register('dependentChildren')}
            />
          </FormField>

          <FormField
            id="annualIncome"
            label="Annual gross income (€)"
            required
            hint="Total yearly income before taxes and insurance contributions."
            error={errors.annualIncome?.message}
          >
            <input
              id="annualIncome"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              placeholder="25000"
              aria-invalid={errors.annualIncome ? 'true' : 'false'}
              aria-describedby={describedBy(
                'annualIncome',
                'Total yearly income before taxes and insurance contributions.',
                errors.annualIncome?.message,
              )}
              {...register('annualIncome')}
            />
          </FormField>

          <FormField
            id="deductibleExpenses"
            label="Deductible expenses (€)"
            required
            hint="Business, medical, donations, or other deductible expenses for the year."
            error={errors.deductibleExpenses?.message}
          >
            <input
              id="deductibleExpenses"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              placeholder="3000"
              aria-invalid={errors.deductibleExpenses ? 'true' : 'false'}
              aria-describedby={describedBy(
                'deductibleExpenses',
                'Business, medical, donations, or other deductible expenses for the year.',
                errors.deductibleExpenses?.message,
              )}
              {...register('deductibleExpenses')}
            />
          </FormField>

          <FormField
            id="notes"
            label="Additional notes"
            hint="Optional — anything you'd like the advisor to consider."
            error={errors.notes?.message}
          >
            <textarea
              id="notes"
              rows={3}
              placeholder="e.g. I recently started freelancing on the side…"
              aria-invalid={errors.notes ? 'true' : 'false'}
              aria-describedby={describedBy(
                'notes',
                "Optional — anything you'd like the advisor to consider.",
                errors.notes?.message,
              )}
              {...register('notes')}
            />
          </FormField>
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </button>
          <button
            type="button"
            className={styles.reset}
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Reset
          </button>
        </div>
      </form>

      {saved && <TaxSummary data={saved.data} savedAt={saved.savedAt} />}
    </div>
  )
}
