export const MIN_COOKIES_PER_ORDER = 4;

// Disabled: the Stripe account behind STRIPE_SECRET_KEY isn't controlled by
// the business owner, so card payouts can't be trusted yet. Re-enable once
// a proper Stripe/CMI account owned by the business is in place.
export const CARD_PAYMENT_ENABLED = false;

// Digits only, country code first, no + or spaces (e.g. 212780615048)
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '212780615048';

export const CURRENCY_LABEL = 'MAD';

export function formatPrice(amount: number): string {
  const value = Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  return `${value} ${CURRENCY_LABEL}`;
}
