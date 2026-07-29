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
