'use client';
import { useCart } from '@/context/CartContext';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { MIN_COOKIES_PER_ORDER } from '@/lib/constants';

export default function CartBar() {
  const { count, total } = useCart();
  const locale = useLocale();
  const tp = useTranslations('products');

  if (count === 0) return null;

  const remaining = Math.max(0, MIN_COOKIES_PER_ORDER - count);
  const ready = count >= MIN_COOKIES_PER_ORDER;
  const progress = Math.min(100, (count / MIN_COOKIES_PER_ORDER) * 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pointer-events-none">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-pink-100 p-4 pointer-events-auto">
        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-plum">
              {ready
                ? '✅ Minimum atteint !'
                : `🍪 Encore ${remaining} cookie${remaining > 1 ? 's' : ''} pour commander`}
            </span>
            <span className="text-rose-main">{count} / {MIN_COOKIES_PER_ORDER} min</span>
          </div>
          <div className="h-2 bg-pink-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${ready ? 'bg-green-400' : 'bg-rose-main'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">{count} cookie{count > 1 ? 's' : ''} sélectionné{count > 1 ? 's' : ''}</p>
            <p className="font-display font-bold text-rose-deep text-lg">{tp('currency')}{total.toFixed(2)}</p>
          </div>

          {ready ? (
            <Link href={`/${locale}/cart`}
              className="bg-rose-main text-white px-6 py-3 rounded-full font-semibold hover:bg-rose-deep transition-all shadow-md hover:shadow-lg text-sm">
              Voir le panier 🛒
            </Link>
          ) : (
            <button disabled
              className="bg-gray-200 text-gray-400 px-6 py-3 rounded-full font-semibold text-sm cursor-not-allowed">
              Minimum {MIN_COOKIES_PER_ORDER} cookies
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
