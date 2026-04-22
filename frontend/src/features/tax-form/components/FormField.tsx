import type { ReactNode } from 'react'
import styles from './FormField.module.css'

type FormFieldProps = {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
}

export function FormField({
  id,
  label,
  error,
  hint,
  required,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>

      <div
        className={styles.control}
        data-has-error={Boolean(error) || undefined}
      >
        {children}
      </div>

      {hint && !error && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
