export function formatCurrency(
  value: number,
  locale: string = 'uk-UA',
  currency: string = 'UAH'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol', // или 'code' / 'symbol'
    minimumFractionDigits: 2,
  }).format(value);
}
