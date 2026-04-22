import {
  employmentCategoryLabels,
  maritalStatusLabels,
  taxResidencyLabels,
  type TaxFormValues,
} from '../schema/taxForm.schema'
import { formatCurrency } from '@/lib/format'
import styles from './TaxSummary.module.css'

type TaxSummaryProps = {
  data: TaxFormValues
  savedAt: string
}

const savedAtFormatter = new Intl.DateTimeFormat('el-GR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function TaxSummary({ data, savedAt }: TaxSummaryProps) {
  const estimatedTaxable = Math.max(
    0,
    data.annualIncome - data.deductibleExpenses,
  )

  const savedAtDisplay = savedAtFormatter.format(new Date(savedAt))

  const rows: Array<{ label: string; value: string }> = [
    { label: 'Name', value: data.fullName },
    { label: 'Age', value: String(data.age) },
    {
      label: 'Tax residency',
      value: taxResidencyLabels[data.taxResidency],
    },
    { label: 'Marital status', value: maritalStatusLabels[data.maritalStatus] },
    {
      label: 'Employment category',
      value: employmentCategoryLabels[data.employmentCategory],
    },
    { label: 'Dependent children', value: String(data.dependentChildren) },
    { label: 'Annual gross income', value: formatCurrency(data.annualIncome) },
    {
      label: 'Deductible expenses',
      value: formatCurrency(data.deductibleExpenses),
    },
    {
      label: 'Estimated taxable base',
      value: formatCurrency(estimatedTaxable),
    },
  ]

  return (
    <section
      className={styles.summary}
      aria-live="polite"
      aria-labelledby="summary-title"
    >
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h2 id="summary-title" className={styles.title}>
            Saved
          </h2>
          <span className={styles.savedAt}>
            Saved at <time dateTime={savedAt}>{savedAtDisplay}</time>
          </span>
        </div>
        <p className={styles.subtitle}>
          Your data is kept for this session and will be available across page
          reloads. AI-powered recommendations tailored to the Greek tax system
          will be generated once the backend is connected in Step 2.
        </p>
      </header>

      <dl className={styles.list}>
        {rows.map((row) => (
          <div key={row.label} className={styles.row}>
            <dt className={styles.term}>{row.label}</dt>
            <dd className={styles.desc}>{row.value}</dd>
          </div>
        ))}
      </dl>

      {data.notes && (
        <div className={styles.notes}>
          <h3 className={styles.notesTitle}>Your notes</h3>
          <p className={styles.notesBody}>{data.notes}</p>
        </div>
      )}
    </section>
  )
}
