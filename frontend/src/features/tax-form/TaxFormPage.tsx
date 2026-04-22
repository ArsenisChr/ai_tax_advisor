import { TaxForm } from './components/TaxForm'
import styles from './TaxFormPage.module.css'

export function TaxFormPage() {
  return (
    <section className={`container ${styles.page}`} aria-labelledby="page-title">
      <header className={styles.header}>
        <h1 id="page-title" className={styles.title}>
          Tax information
        </h1>
        <p className={styles.subtitle}>
          Tell us about your financial situation. We&apos;ll use this information
          to generate personalized tax guidance.
        </p>
      </header>

      <TaxForm />
    </section>
  )
}
