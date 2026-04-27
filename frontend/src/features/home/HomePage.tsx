import { Link } from 'react-router-dom'
import styles from './HomePage.module.css'

const features = [
  {
    title: 'Step 1: Fill in the form',
    description:
      'Navigate to the tax form page and fill in the form with your income and expenses.',
    icon: '📝',
  },
  {
    title: 'Step 2: Submit the form',
    description:
      'Submit the form to get your tax insights from the AI assistant.',
    icon: '🚀',
  },
  {
    title: 'Step 3: Get your AI tax insights',
    description:
      'Review the generated guidance below your submitted form and understand the reasoning behind every suggestion.',
    icon: '💡',
  },
] as const

export function HomePage() {
  return (
    <div className={styles.page}>
      <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
        <div className={styles.heroContent}>
          <span className={styles.badge}>AI-powered · Built for clarity</span>
          <h1 id="hero-title" className={styles.title}>
            Smarter tax decisions,
            <br />
            explained simply.
          </h1>
          <p className={styles.subtitle}>
            Share a few details about your income and expenses, and get tax
            guidance with concise explanations.
          </p>
          <div className={styles.ctaGroup}>
            <Link to="/tax-form" className={styles.ctaPrimary}>
              Go to tax form
            </Link>
            <a
              href="#how-it-works"
              className={styles.ctaSecondary}
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      <section
        className={`container ${styles.about}`}
        aria-labelledby="about-title"
      >
        <h2 id="about-title" className={styles.sectionTitle}>
          What is AI Tax Advisor?
        </h2>
        <div className={styles.aboutContent}>
          <p className={styles.aboutLead}>
            AI Tax Advisor is a full-stack web application that turns a few
            financial details into clear tax guidance.
          </p>
          <p className={styles.aboutText}>
            You fill in a short form with your annual income, deductible
            expenses, filing status, and number of dependents. The app sends
            that information to an AI model and returns practical suggestions
            in everyday language.
          </p>
          <p className={styles.aboutText}>
            Your latest form submission and response are stored in
            sessionStorage for the current browser tab (cleared when the tab
            closes). Data is only sent to backend services required to generate
            the advice. The goal is to support understanding, not replace a
            certified accountant.
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className={`container ${styles.features}`}
        aria-labelledby="features-title"
      >
        <h2 id="features-title" className={styles.sectionTitle}>
          How it works
        </h2>
        <ul className={styles.featureGrid}>
          {features.map((feature) => (
            <li key={feature.title} className={styles.featureCard}>
              <span className={styles.featureIcon} aria-hidden="true">
                {feature.icon}
              </span>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
