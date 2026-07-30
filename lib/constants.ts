export const MIN_COOKIES_PER_ORDER = 4;

// Digits only, country code first, no + or spaces (e.g. 212780615048)
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '212780615048';

export const CURRENCY_LABEL = 'MAD';

export function formatPrice(amount: number): string {
  const value = Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  return `${value} ${CURRENCY_LABEL}`;
}
