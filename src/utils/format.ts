export const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency
  }).format(amount);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(new Date(iso));

