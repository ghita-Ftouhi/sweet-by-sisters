export interface Product {
  id: string;
  slug: string;
  emoji: string;
  images?: string[];
  nameEn: string;
  nameFr: string;
  nameAr: string;
  descEn: string;
  descFr: string;
  descAr: string;
  price: number;
  inStock: boolean;
  badge?: 'new' | 'bestseller' | 'limited';
  boxEligible: boolean;
}

export function getProductName(p: Product, locale: string) {
  if (locale === 'ar') return p.nameAr;
  if (locale === 'fr') return p.nameFr;
  return p.nameEn;
}

export function getProductDesc(p: Product, locale: string) {
  if (locale === 'ar') return p.descAr;
  if (locale === 'fr') return p.descFr;
  return p.descEn;
}
