/**
 * Builds the `aria-describedby` value for a form control.
 *
 * Mirrors the rendering rule of `FormField`: the hint element is hidden
 * from the DOM when an error is shown (`hint && !error`). Therefore the
 * hint ID is excluded once an error is present, otherwise `aria-describedby`
 * would reference an element that does not exist.
 */
export function describedBy(
  id: string,
  hint?: string,
  error?: string,
): string | undefined {
  const ids = [
    hint && !error ? `${id}-hint` : null,
    error ? `${id}-error` : null,
  ].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
}
