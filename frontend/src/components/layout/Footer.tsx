import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>
          &copy; {year} AI Tax Advisor. Built for educational purposes.
        </p>
      </div>
    </footer>
  )
}
