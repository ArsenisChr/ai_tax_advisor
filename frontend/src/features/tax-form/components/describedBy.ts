export function describedBy(
  id: string,
  hint?: string,
  error?: string,
): string | undefined {
  const ids = [
    hint ? `${id}-hint` : null,
    error ? `${id}-error` : null,
  ].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
}
