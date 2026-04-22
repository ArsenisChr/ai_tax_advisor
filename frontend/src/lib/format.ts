const currencyFormatter = new Intl.NumberFormat('el-GR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return '—'
  return currencyFormatter.format(value)
}
