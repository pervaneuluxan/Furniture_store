const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const wholeMoney = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** $1,290 for whole amounts, $25.60 otherwise. */
export const formatPrice = (value) => {
  const number = Number(value) || 0;
  return Number.isInteger(number) ? wholeMoney.format(number) : money.format(number);
};

/** 12 March 2026 */
export const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};
