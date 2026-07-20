import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-blush to-cream pt-10 pb-4 px-4 text-center relative overflow-hidden">
        <p className="text-rose-main text-sm uppercase tracking-widest font-semibold mb-4">{t('subtitle')}</p>
        <h1 className="font-display text-5xl font-bold text-plum mb-6">{t('title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">{t('story')}</p>
      </div>

      {/* Sisters section */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">

          {/* Photo */}
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="/sisters.png"
              alt="Sweets by Sisters"
              width={600}
              height={700}
              className="w-full object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-rose-main text-sm uppercase tracking-widest font-semibold mb-3">💕 Notre Histoire</p>
            <h2 className="font-display text-3xl font-bold text-plum mb-5">Deux sœurs, une passion</h2>

            <div className="flex flex-col gap-4 text-gray-600 leading-relaxed">
              <p>
                Tout a commencé dans notre petite cuisine familiale, entre rires, farine et chocolat fondu.
                Depuis toutes petites, nous avons partagé la même passion : créer des douceurs qui réchauffent le cœur.
              </p>
              <p>
                <span className="font-semibold text-plum">Sweets by Sisters</span> est née de cette complicité unique
                entre deux sœurs qui croient que chaque bouchée peut raconter une histoire. Nous préparons chaque cookie,
                chaque box avec soin, amour et les meilleurs ingrédients — comme si c'était pour notre propre famille.
              </p>
              <p>
                Notre mission est simple : vous apporter un moment de bonheur sucré, que ce soit pour vous gâter,
                offrir un cadeau ou partager un instant précieux avec vos proches.
              </p>
              <p className="italic text-rose-deep font-medium">
                "Baked with passion, shared with love." 🍪
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <span className="bg-rose-blush text-rose-deep text-xs font-semibold px-3 py-1.5 rounded-full">#HandmadeWithLove</span>
              <span className="bg-rose-blush text-rose-deep text-xs font-semibold px-3 py-1.5 rounded-full">#SweetsBysisters</span>
              <span className="bg-rose-blush text-rose-deep text-xs font-semibold px-3 py-1.5 rounded-full">#BakedWithPassion</span>
            </div>
          </div>
        </div>

        {/* Values */}
        <h2 className="font-display text-3xl font-bold text-plum text-center mb-12">{t('values_title')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '🤲', title: t('value1_title'), desc: t('value1_desc') },
            { icon: '🌿', title: t('value2_title'), desc: t('value2_desc') },
            { icon: '💕', title: t('value3_title'), desc: t('value3_desc') },
          ].map((v, i) => (
            <div key={i} className="text-center bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl mb-4">{v.icon}</div>
              <h3 className="font-display text-xl font-bold text-plum mb-3">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
