import { useEffect, useState } from 'react'

/**
 * Tiny React hook that keeps a piece of state in sync with `sessionStorage`.
 *
 * - The value lives for the lifetime of the browser tab.
 * - It survives route changes and hard refreshes (F5).
 * - Closing the tab clears it — no manual cleanup needed.
 *
 * Usage:
 *   const [user, setUser] = useSessionStorage<User | null>('user', null)
 */
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = window.sessionStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch {
      // sessionStorage can throw (quota exceeded, disabled). Fail silently.
    }
  }, [key, value])

  return [value, setValue] as const
}
