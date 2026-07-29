'use client';
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { getProductName } from '@/lib/products';
import Link from 'next/link';
import { useState } from 'react';
import { MIN_COOKIES_PER_ORDER, WHATSAPP_NUMBER } from '@/lib/constants';

async function saveOrderToDB(orderItems: unknown[], boxes: unknown[], total: number, paymentMethod: 'card' | 'whatsapp', locale: string) {
  try {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ total, payment_method: paymentMethod, locale, items: [...(orderItems as []), ...(boxes as [])] }),
    });
  } catch { /* non-bloquant */ }
}

function buildWhatsAppUrl(
  items: { name: string; price: number; quantity: number; emoji: string }[],
  boxes: { packName: string; emoji: string; price: number; size: number; contents: { name: string; emoji: string; quantity: number }[] }[],
  total: number
) {
  const itemLines = items.map(i => `🍪 ${i.name} x${i.quantity} — €${(i.price * i.quantity).toFixed(2)}`);
  const boxLines = boxes.map(b => {
    const contents = b.contents.map(c => `    🍪 ${c.name} x${c.quantity}`).join('\n');
    return `🍪 ${b.packName} (${b.size} cookies) — €${b.price.toFixed(2)}\n${contents}`;
  });
  const allLines = [...itemLines, ...boxLines].join('\n');
  const message = `🍪 *Nouvelle commande Sweets by Sisters* 🍪\n\n${allLines}\n\n*Total : €${total.toFixed(2)}*\n\n🍪 Merci pour votre commande ! 💕`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function CartPage() {
  const t = useTranslations('cart');
  const tp = useTranslations('products');
  const locale = useLocale();
  const { items, boxes, removeItem, updateQty, removeBox, total, count } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const ready = count >= MIN_COOKIES_PER_ORDER;

  const buildOrderItems = () => [
    ...items.map(({ product, quantity }) => ({
      name: getProductName(product, locale), price: product.price, quantity, emoji: product.emoji, type: 'cookie' as const,
    })),
    ...boxes.map(b => ({
      name: b.packName, price: b.price, quantity: 1, emoji: b.emoji, type: 'box' as const, contents: b.contents,
    })),
  ];

  const handleCheckout = async () => {
    if (!ready) return;
    setLoading(true);
    setError('');
    try {
      const allItems = buildOrderItems();
      await saveOrderToDB(allItems, [], total, 'card', locale);
      const stripeItems = allItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity, emoji: i.emoji }));
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, items: stripeItems }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Erreur lors du paiement');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = items.length === 0 && boxes.length === 0;

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-gradient-to-br from-rose-blush to-pink-50 py-16 px-4 text-center">
        <h1 className="font-display text-4xl font-bold text-plum">{t('title')}</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {isEmpty ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">🛒</div>
            <h2 className="font-display text-2xl font-bold text-plum mb-2">{t('empty')}</h2>
            <p className="text-gray-500 mb-8">{t('empty_sub')}</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href={`/${locale}/products`}
                className="bg-rose-main text-white px-8 py-3 rounded-full font-semibold hover:bg-rose-deep transition-all shadow-md">
                {t('shop_now')}
              </Link>
              <Link href={`/${locale}/packs`}
                className="bg-plum text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-all shadow-md">
                Voir les packs 🎁
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">

            {/* Individual cookies */}
            {items.map(({ product, quantity }) => (
              <div key={product.id}
                className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-5">
                <div className="w-16 h-16 rounded-xl bg-rose-blush flex items-center justify-center text-3xl flex-shrink-0">
                  {product.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-plum truncate">{getProductName(product, locale)}</p>
                  <p className="text-rose-deep font-bold">{tp('currency')}{product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(product.id, quantity - 1)}
                    className="w-7 h-7 rounded-full bg-rose-blush text-rose-deep font-bold text-lg flex items-center justify-center hover:bg-rose-soft transition-colors">
                    −
                  </button>
                  <span className="w-6 text-center font-semibold text-plum">{quantity}</span>
                  <button onClick={() => updateQty(product.id, quantity + 1)}
                    className="w-7 h-7 rounded-full bg-rose-blush text-rose-deep font-bold text-lg flex items-center justify-center hover:bg-rose-soft transition-colors">
                    +
                  </button>
                </div>
                <button onClick={() => removeItem(product.id)}
                  className="text-gray-300 hover:text-rose-main transition-colors text-xl ml-2">
                  ×
                </button>
              </div>
            ))}

            {/* Boxes */}
            {boxes.map(box => (
              <div key={box.id} className="bg-white rounded-2xl p-5 shadow-sm border-2 border-rose-blush">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-rose-blush flex items-center justify-center text-3xl flex-shrink-0">
                    {box.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-plum">{box.packName}</p>
                    <p className="text-rose-deep font-bold">€{box.price.toFixed(2)}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {box.contents.map(c => (
                        <span key={c.productId} className="bg-rose-blush text-plum text-xs px-2 py-0.5 rounded-full font-medium">
                          {c.emoji} {c.name} ×{c.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => removeBox(box.id)}
                    className="text-gray-300 hover:text-rose-main transition-colors text-xl">
                    ×
                  </button>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="font-display text-xl font-bold text-plum">{t('total')}</span>
                <span className="font-display text-2xl font-bold text-rose-deep">
                  {tp('currency')}{total.toFixed(2)}
                </span>
              </div>

              {!ready && (
                <p className="text-center text-xs text-rose-main mb-3 font-medium">
                  🍪 Encore {MIN_COOKIES_PER_ORDER - count} cookie{MIN_COOKIES_PER_ORDER - count > 1 ? 's' : ''} pour valider
                </p>
              )}

              {error && (
                <p className="text-center text-xs text-red-500 mb-3">{error}</p>
              )}

              {ready ? (
                <div className="flex flex-col gap-3">
                  <button onClick={handleCheckout} disabled={loading}
                    className="w-full py-4 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2 bg-rose-main text-white hover:bg-rose-deep shadow-md hover:shadow-lg active:scale-95 cursor-pointer disabled:opacity-60">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Redirection...
                      </>
                    ) : <>💳 Payer par carte</>}
                  </button>

                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span>ou</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  <a href={buildWhatsAppUrl(
                      items.map(({ product, quantity }) => ({ name: getProductName(product, locale), price: product.price, quantity, emoji: product.emoji })),
                      boxes,
                      total
                    )}
                    onClick={() => saveOrderToDB(buildOrderItems(), [], total, 'whatsapp', locale)}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full py-4 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#1ebe5a] shadow-md active:scale-95">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Commander via WhatsApp
                  </a>

                  <p className="text-center text-xs text-gray-400">
                    🔒 Carte sécurisée par Stripe · 💬 WhatsApp pour paiement à la livraison
                  </p>
                </div>
              ) : (
                <button disabled
                  className="w-full py-4 rounded-full font-semibold text-lg bg-gray-200 text-gray-400 cursor-not-allowed">
                  Minimum {MIN_COOKIES_PER_ORDER} cookies requis
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
