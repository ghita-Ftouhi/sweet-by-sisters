'use client';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import { Product, getProductName, getProductDesc } from '@/lib/products';
import { useCart } from '@/context/CartContext';

const badgeStyle: Record<string, string> = {
  bestseller: 'bg-gold text-white',
  new:        'bg-rose-main text-white',
  limited:    'bg-plum text-white',
};
const badgeLabel: Record<string, Record<string, string>> = {
  bestseller: { en: 'Bestseller', fr: 'Populaire', ar: 'الأكثر مبيعاً' },
  new:        { en: 'New',        fr: 'Nouveau',   ar: 'جديد' },
  limited:    { en: 'Limited',    fr: 'Limité',    ar: 'محدود' },
};

export default function ProductCard({ product }: { product: Product }) {
  const t = useTranslations('products');
  const locale = useLocale();
  const { addItem, removeItem, updateQty, items } = useCart();
  const [imgIndex, setImgIndex] = useState(0);

  const cartItem = items.find(i => i.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => addItem(product);
  const handleIncrease = () => updateQty(product.id, quantity + 1);
  const handleDecrease = () => {
    if (quantity === 1) removeItem(product.id);
    else updateQty(product.id, quantity - 1);
  };

  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      {/* Image area */}
      <div className="h-44 bg-gradient-to-br from-rose-blush to-pink-100 flex items-center justify-center relative overflow-hidden">
        {hasImages ? (
          <>
            <Image
              src={product.images![imgIndex]}
              alt={getProductName(product, locale)}
              fill
              className="object-cover transition-opacity duration-300"
            />
            {/* Slider dots */}
            {product.images!.length > 1 && (
              <>
                <button onClick={() => setImgIndex(i => (i - 1 + product.images!.length) % product.images!.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full w-6 h-6 flex items-center justify-center text-plum font-bold text-xs shadow z-10">
                  ‹
                </button>
                <button onClick={() => setImgIndex(i => (i + 1) % product.images!.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full w-6 h-6 flex items-center justify-center text-plum font-bold text-xs shadow z-10">
                  ›
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                  {product.images!.map((_, i) => (
                    <button key={i} onClick={() => setImgIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-white w-3' : 'bg-white/50'}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <span className="text-7xl group-hover:scale-110 transition-transform duration-300 select-none">
            {product.emoji}
          </span>
        )}

        {product.badge && (
          <span className={`absolute top-3 ${locale === 'ar' ? 'left-3' : 'right-3'} text-[10px] font-bold px-2 py-0.5 rounded-full z-10 ${badgeStyle[product.badge]}`}>
            {badgeLabel[product.badge][locale]}
          </span>
        )}
        {quantity > 0 && (
          <span className="absolute top-3 left-3 bg-rose-deep text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md z-10">
            {quantity}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-plum text-lg leading-tight">
          {getProductName(product, locale)}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {getProductDesc(product, locale)}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-rose-deep font-bold text-lg">
            {t('currency')}{product.price.toFixed(2)}
          </span>

          {!product.inStock ? (
            <span className="text-xs text-gray-400 italic">{t('out_of_stock')}</span>
          ) : quantity === 0 ? (
            <button onClick={handleAdd}
              className="bg-rose-main text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-rose-deep transition-all hover:shadow-md">
              {t('add_to_cart')}
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-rose-blush rounded-full px-2 py-1">
              <button onClick={handleDecrease}
                className="w-7 h-7 rounded-full bg-white text-rose-deep font-bold text-lg flex items-center justify-center shadow-sm hover:bg-rose-soft transition-colors">
                −
              </button>
              <span className="w-6 text-center font-bold text-plum text-sm">{quantity}</span>
              <button onClick={handleIncrease}
                className="w-7 h-7 rounded-full bg-rose-main text-white font-bold text-lg flex items-center justify-center shadow-sm hover:bg-rose-deep transition-colors">
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
