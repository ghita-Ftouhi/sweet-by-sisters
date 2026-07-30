'use client';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Pack, getPackName, getPackDesc } from '@/lib/packs';
import { Product, getProductName } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/constants';

type Selection = Record<string, number>;

function PackCard({ pack, onSelect }: { pack: Pack; onSelect: (pack: Pack) => void }) {
  const locale = useLocale();
  const discount = Math.round(((pack.originalPrice - pack.price) / pack.originalPrice) * 100);

  return (
    <div className={`relative bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 flex flex-col ${pack.popular ? 'ring-2 ring-rose-main' : ''}`}>
      {pack.badge && (
        <div className={`${pack.badgeColor} text-white text-xs font-bold px-3 py-1 text-center`}>
          {pack.badge}
        </div>
      )}
      <div className="p-7 flex flex-col flex-1">
        <div className="text-5xl mb-4 text-center">{pack.emoji}</div>
        <h3 className="font-display text-xl font-bold text-plum text-center mb-1">{getPackName(pack, locale)}</h3>
        <p className="text-gray-400 text-sm text-center mb-4">{getPackDesc(pack, locale)}</p>

        <div className="bg-rose-blush rounded-2xl p-4 mb-6 text-center">
          <p className="text-xs text-gray-400 mb-1">{pack.size} cookies</p>
          <div className="flex items-center justify-center gap-2">
            <span className="font-display text-3xl font-bold text-rose-deep">{formatPrice(pack.price)}</span>
            <div className="flex flex-col items-start">
              <span className="text-xs line-through text-gray-400">{formatPrice(pack.originalPrice)}</span>
              <span className="text-xs font-bold text-green-500">-{discount}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">soit {formatPrice(pack.price / pack.size)} / cookie</p>
        </div>

        <button onClick={() => onSelect(pack)}
          className="mt-auto w-full bg-rose-main text-white py-3 rounded-full font-semibold hover:bg-rose-deep transition-all shadow-md hover:shadow-lg active:scale-95">
          Composer ma box 🍪
        </button>
      </div>
    </div>
  );
}

function BoxBuilder({ pack, products, onClose }: { pack: Pack; products: Product[]; onClose: () => void }) {
  const locale = useLocale();
  const router = useRouter();
  const { addBox } = useCart();
  const [selection, setSelection] = useState<Selection>({});
  const availableProducts = products.filter(p => p.inStock);

  const total = Object.values(selection).reduce((a, b) => a + b, 0);
  const remaining = pack.size - total;

  const change = (id: string, delta: number) => {
    setSelection(prev => {
      const current = prev[id] ?? 0;
      const next = Math.max(0, current + delta);
      if (delta > 0 && total >= pack.size) return prev;
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleAdd = () => {
    if (total !== pack.size) return;
    const contents = Object.entries(selection).map(([productId, qty]) => {
      const p = products.find(x => x.id === productId)!;
      return { productId, name: getProductName(p, locale), emoji: p.emoji, quantity: qty };
    });
    addBox({
      packId: pack.id,
      packName: getPackName(pack, locale),
      emoji: pack.emoji,
      price: pack.price,
      size: pack.size,
      contents,
    });
    onClose();
    router.push(`/${locale}/cart`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
      onClick={onClose}>
      <div className="absolute inset-0 bg-plum/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="p-6 border-b border-pink-100 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-plum">
              {pack.emoji} {getPackName(pack, locale)}
            </h2>
            <p className="text-sm text-gray-400">Choisissez {pack.size} cookies</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-rose-main text-2xl transition-colors">×</button>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 bg-rose-blush/40">
          <div className="flex justify-between text-sm font-semibold mb-1.5">
            <span className="text-plum">
              {remaining > 0 ? `Encore ${remaining} cookie${remaining > 1 ? 's' : ''} à choisir` : '✅ Box complète !'}
            </span>
            <span className="text-rose-main">{total} / {pack.size}</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-300 ${total === pack.size ? 'bg-green-400' : 'bg-rose-main'}`}
              style={{ width: `${(total / pack.size) * 100}%` }} />
          </div>
        </div>

        {/* Cookies list */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {availableProducts.map(p => (
            <div key={p.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
              <div className="w-12 h-12 bg-rose-blush rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-plum text-sm">{getProductName(p, locale)}</p>
                <p className="text-xs text-gray-400">{formatPrice(p.price)} / cookie</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => change(p.id, -1)} disabled={!selection[p.id]}
                  className="w-7 h-7 rounded-full bg-white border border-pink-200 text-rose-deep font-bold flex items-center justify-center hover:bg-rose-blush transition-colors disabled:opacity-30">
                  −
                </button>
                <span className="w-5 text-center font-bold text-plum text-sm">{selection[p.id] ?? 0}</span>
                <button onClick={() => change(p.id, 1)} disabled={total >= pack.size}
                  className="w-7 h-7 rounded-full bg-rose-main text-white font-bold flex items-center justify-center hover:bg-rose-deep transition-colors disabled:opacity-30">
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-pink-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400">{pack.size} cookies · {formatPrice(pack.price)}</span>
            <span className="font-display text-xl font-bold text-rose-deep">{formatPrice(pack.price)}</span>
          </div>
          <button onClick={handleAdd} disabled={total !== pack.size}
            className={`w-full py-3.5 rounded-full font-semibold text-base transition-all ${
              total === pack.size
                ? 'bg-rose-main text-white hover:bg-rose-deep shadow-md active:scale-95 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
            {total === pack.size ? 'Ajouter au panier 🛒' : `Il manque ${remaining} cookie${remaining > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomBoxBuilder({ products, packs }: { products: Product[]; packs: Pack[] }) {
  const locale = useLocale();
  const router = useRouter();
  const { addBox } = useCart();
  const [size, setSize] = useState<6 | 12 | 18>(6);
  const [selection, setSelection] = useState<Selection>({});
  const availableProducts = products.filter(p => p.inStock);

  const total = Object.values(selection).reduce((a, b) => a + b, 0);
  const remaining = size - total;

  const priceForSize = (s: number) => packs.find(p => p.size === s)?.price ?? 0;
  const boxPrice = priceForSize(size);
  const pricePerCookie = boxPrice / size;

  const change = (id: string, delta: number) => {
    setSelection(prev => {
      const current = prev[id] ?? 0;
      const next = Math.max(0, current + delta);
      if (delta > 0 && total >= size) return prev;
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleSizeChange = (s: 6 | 12 | 18) => {
    setSize(s);
    setSelection({});
  };

  const handleAdd = () => {
    if (total !== size) return;
    const contents = Object.entries(selection).map(([productId, qty]) => {
      const p = products.find(x => x.id === productId)!;
      return { productId, name: getProductName(p, locale), emoji: p.emoji, quantity: qty };
    });
    addBox({
      packId: 'custom',
      packName: `Ma Box Personnalisée (${size})`,
      emoji: '✨',
      price: boxPrice,
      size,
      contents,
    });
    router.push(`/${locale}/cart`);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">✨</div>
        <h2 className="font-display text-2xl font-bold text-plum mb-2">Compose ta Box</h2>
        <p className="text-gray-400">Tu choisis les saveurs, on s'occupe du reste !</p>
      </div>

      {/* Size selector */}
      <div className="flex gap-3 mb-8">
        {([6, 12, 18] as const).map(s => (
          <button key={s} onClick={() => handleSizeChange(s)}
            className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-all border-2 ${
              size === s ? 'bg-rose-main text-white border-rose-main shadow-md' : 'bg-white text-plum border-pink-200 hover:border-rose-main'
            }`}>
            {s} cookies<br />
            <span className="font-bold text-base">{formatPrice(priceForSize(s))}</span>
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-rose-blush/40 rounded-2xl p-4 mb-6">
        <div className="flex justify-between text-sm font-semibold mb-1.5">
          <span className="text-plum">
            {remaining > 0 ? `Encore ${remaining} cookie${remaining > 1 ? 's' : ''} à choisir` : '✅ Box complète !'}
          </span>
          <span className="text-rose-main">{total} / {size}</span>
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${total === size ? 'bg-green-400' : 'bg-rose-main'}`}
            style={{ width: `${(total / size) * 100}%` }} />
        </div>
      </div>

      {/* Cookies */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {availableProducts.map(p => (
          <div key={p.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
            <div className="w-11 h-11 bg-rose-blush rounded-xl flex items-center justify-center text-xl flex-shrink-0">
              {p.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-plum text-sm truncate">{getProductName(p, locale)}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => change(p.id, -1)} disabled={!selection[p.id]}
                className="w-7 h-7 rounded-full bg-white border border-pink-200 text-rose-deep font-bold flex items-center justify-center hover:bg-rose-blush transition-colors disabled:opacity-30">
                −
              </button>
              <span className="w-5 text-center font-bold text-plum text-sm">{selection[p.id] ?? 0}</span>
              <button onClick={() => change(p.id, 1)} disabled={total >= size}
                className="w-7 h-7 rounded-full bg-rose-main text-white font-bold flex items-center justify-center hover:bg-rose-deep transition-colors disabled:opacity-30">
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">soit {formatPrice(pricePerCookie)} / cookie</p>
        <p className="font-display text-2xl font-bold text-rose-deep">{formatPrice(boxPrice)}</p>
      </div>

      <button onClick={handleAdd} disabled={total !== size}
        className={`w-full py-4 rounded-full font-semibold text-lg transition-all ${
          total === size
            ? 'bg-rose-main text-white hover:bg-rose-deep shadow-md active:scale-95 cursor-pointer'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}>
        {total === size ? 'Ajouter ma box au panier 🛒' : `Il manque ${remaining} cookie${remaining > 1 ? 's' : ''}`}
      </button>
    </div>
  );
}

export default function PacksClient({ products, packs }: { products: Product[]; packs: Pack[] }) {
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  return (
    <div className="min-h-screen bg-cream pb-20">
      {selectedPack && <BoxBuilder pack={selectedPack} products={products} onClose={() => setSelectedPack(null)} />}

      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-blush to-pink-50 py-20 px-4 text-center">
        <p className="text-rose-main text-sm uppercase tracking-widest font-semibold mb-3">🎁 Sweet by Sister</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-plum mb-4">Nos Packs & Box</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Commandez plus, économisez plus — et choisissez vos saveurs préférées !</p>
      </div>

      {/* Fixed packs */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-display text-2xl font-bold text-plum text-center mb-2">Packs prêts à composer</h2>
        <p className="text-gray-400 text-center mb-10">Choisissez votre taille et sélectionnez vos saveurs</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {packs.map(pack => (
            <PackCard key={pack.id} pack={pack} onSelect={setSelectedPack} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 h-px bg-pink-200" />
          <span className="text-rose-main font-semibold text-sm px-4">ou</span>
          <div className="flex-1 h-px bg-pink-200" />
        </div>
      </div>

      {/* Custom builder */}
      <div className="max-w-2xl mx-auto px-4">
        <CustomBoxBuilder products={products} packs={packs} />
      </div>
    </div>
  );
}
