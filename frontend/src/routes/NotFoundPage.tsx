import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <section className={`container ${styles.page}`} aria-labelledby="nf-title">
      <p className={styles.code}>404</p>
      <h1 id="nf-title" className={styles.title}>
        Page not found
      </h1>
      <p className={styles.text}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className={styles.link}>
        ← Back to home
      </Link>
    </section>
  )
}
