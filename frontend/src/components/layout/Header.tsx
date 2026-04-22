import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/tax-form', label: 'Tax Form', end: false },
] as const

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <NavLink to="/" className={styles.brand} aria-label="AI Tax Advisor home">
          <span className={styles.brandMark} aria-hidden="true">
            AI
          </span>
          <span className={styles.brandText}>Tax Advisor</span>
        </NavLink>

        <nav aria-label="Primary">
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
