import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';

function HeroSection() {
  const t = useTranslations('hero');
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-blush via-pink-50 to-cream min-h-[90vh] flex items-center">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-rose-soft/30 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-pink-200/40 blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center w-full">
        <div className="animate-slide-up">
          <p className="text-rose-main font-semibold text-sm uppercase tracking-widest mb-4">Sweet by Sister ✨</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-plum leading-tight mb-6">
            {t('tagline')}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md">
            {t('subtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <HeroCTA />
          </div>
        </div>

        {/* Emoji grid */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          {['🍪', '🧁', '🍫', '🌸', '🍯', '💕'].map((e, i) => (
            <div key={i}
              className="aspect-square rounded-2xl bg-white/70 shadow-sm flex items-center justify-center text-5xl"
              style={{ animationDelay: `${i * 0.1}s`, animation: 'float 3s ease-in-out infinite' }}>
              {e}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroCTA() {
  const t = useTranslations('hero');
  const tNav = useTranslations('nav');
  return (
    <>
      <CTALink href="products" label={t('cta')} primary />
      <CTALink href="about" label={t('cta2')} primary={false} />
    </>
  );
}

async function CTALink({ href, label, primary }: { href: string; label: string; primary: boolean }) {
  const locale = await getLocale();
  return (
    <Link href={`/${locale}/${href}`}
      className={primary
        ? 'bg-rose-main text-white px-8 py-3.5 rounded-full font-semibold hover:bg-rose-deep transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5'
        : 'border-2 border-rose-main text-rose-main px-8 py-3.5 rounded-full font-semibold hover:bg-rose-blush transition-all'
      }>
      {label}
    </Link>
  );
}

function FeaturedSection() {
  const t = useTranslations('featured');
  const featured = products.filter(p => p.badge === 'bestseller' || p.badge === 'new').slice(0, 3);
  return (
    <section className="max-w-6xl mx-auto px-4 py-20">
      <p className="text-rose-main text-center text-sm uppercase tracking-widest font-semibold mb-2">✨ {t('title')}</p>
      <h2 className="font-display text-4xl font-bold text-plum text-center mb-3">{t('title')}</h2>
      <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">{t('subtitle')}</p>
      <div className="grid md:grid-cols-3 gap-6">
        {featured.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

function BannerSection() {
  return (
    <section className="bg-gradient-to-r from-rose-deep to-plum text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-4xl mb-4">🍪 💕 🍪</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Made with Love, Just for You</h2>
        <p className="text-pink-200 text-lg max-w-xl mx-auto">
          Every cookie is baked fresh to order — no preservatives, just pure happiness in every bite.
        </p>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <BannerSection />
    </>
  );
}
