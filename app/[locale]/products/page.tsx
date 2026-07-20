import { useTranslations } from 'next-intl';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import CartBar from '@/components/CartBar';

export default function ProductsPage() {
  const t = useTranslations('products');

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="relative py-32 px-4 text-center overflow-hidden">
        {/* Photo de fond */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/cookies-bg.jpg')" }} />
        {/* Overlay sombre pour lisibilité */}
        <div className="absolute inset-0 bg-black/20" />
        {/* Contenu */}
        <div className="relative z-10">
          <p className="text-pink-300 text-sm uppercase tracking-widest font-bold mb-3">🍪 Sweet by Sisters</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">{t('title')}</h1>
          <p className="text-white/80 max-w-xl mx-auto text-lg">{t('subtitle')}</p>
          <p className="text-pink-300 text-sm mt-3 font-semibold">Minimum 4 cookies par commande</p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      <CartBar />
    </div>
  );
}
