export interface Pack {
  id: string;
  emoji: string;
  nameEn: string;
  nameFr: string;
  nameAr: string;
  descEn: string;
  descFr: string;
  descAr: string;
  size: number;
  price: number;
  originalPrice: number;
  badge?: string;
  badgeColor?: string;
  popular?: boolean;
}

export const packs: Pack[] = [
  {
    id: 'pack-6',
    emoji: '🎀',
    nameEn: 'Discovery Box',
    nameFr: 'Box Découverte',
    nameAr: 'صندوق الاكتشاف',
    descEn: 'Perfect for trying our flavors. 6 cookies of your choice.',
    descFr: 'Parfait pour découvrir nos saveurs. 6 cookies de votre choix.',
    descAr: 'مثالي لتجربة نكهاتنا. 6 كوكيز من اختيارك.',
    size: 6,
    price: 18,
    originalPrice: 21,
    badge: 'Populaire',
    badgeColor: 'bg-rose-main',
    popular: true,
  },
  {
    id: 'pack-12',
    emoji: '💝',
    nameEn: 'Gourmet Box',
    nameFr: 'Box Gourmande',
    nameAr: 'صندوق الذواقة',
    descEn: 'The perfect gift box. 12 cookies of your choice.',
    descFr: 'La boîte cadeau parfaite. 12 cookies de votre choix.',
    descAr: 'صندوق الهدايا المثالي. 12 كوكيز من اختيارك.',
    size: 12,
    price: 34,
    originalPrice: 42,
    badge: 'Meilleur choix',
    badgeColor: 'bg-gold',
  },
  {
    id: 'pack-18',
    emoji: '👨‍👩‍👧‍👦',
    nameEn: 'Family Box',
    nameFr: 'Box Famille',
    nameAr: 'صندوق العائلة',
    descEn: 'Made to share! 18 cookies of your choice.',
    descFr: 'Fait pour partager ! 18 cookies de votre choix.',
    descAr: 'صُنع للمشاركة! 18 كوكيز من اختيارك.',
    size: 18,
    price: 48,
    originalPrice: 63,
    badge: 'Meilleure valeur',
    badgeColor: 'bg-plum',
  },
];

export function getPackName(p: Pack, locale: string) {
  if (locale === 'ar') return p.nameAr;
  if (locale === 'fr') return p.nameFr;
  return p.nameEn;
}

export function getPackDesc(p: Pack, locale: string) {
  if (locale === 'ar') return p.descAr;
  if (locale === 'fr') return p.descFr;
  return p.descEn;
}
