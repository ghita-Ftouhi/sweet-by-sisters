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
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'triple-chocolate',
    emoji: '🍫',
    images: ['/triple-choc-ext.jpg', '/triple-choc-int.jpg'],
    nameEn: 'Triple Chocolate',
    nameFr: 'Cookie Triple Chocolat',
    nameAr: 'كوكيز ثلاثي الشوكولاتة',
    descEn: 'Dark, milk and white chocolate chunks in one irresistible cookie.',
    descFr: 'Chocolat noir, au lait et blanc réunis dans un cookie irrésistible.',
    descAr: 'شوكولاتة داكنة وحليب وبيضاء في كوكيز لا يُقاوم.',
    price: 4.0,
    inStock: true,
    badge: 'bestseller',
  },
  {
    id: '2',
    slug: 'kinder-bueno',
    emoji: '🤎',
    images: ['/kinder-ext.jpg', '/kinder-int.jpg'],
    nameEn: 'Kinder Bueno',
    nameFr: 'Cookie Kinder Bueno',
    nameAr: 'كوكيز كيندر بوينو',
    descEn: 'Soft cookie filled with authentic Kinder Bueno cream, topped with crunchy hazelnuts and Bueno pieces.',
    descFr: 'Cookie moelleux fourré à la vraie crème de Kinder Bueno, garni de noisettes croquantes et morceaux de Bueno.',
    descAr: 'كوكيز طري محشو بكريمة كيندر بوينو الأصلية مع البندق المقرمش وقطع البوينو.',
    price: 4.5,
    inStock: true,
    badge: 'new',
  },
  {
    id: '3',
    slug: 'red-velvet',
    emoji: '❤️',
    images: ['/redvelvet-ext.jpg', '/redvelvet-int.jpg'],
    nameEn: 'Red Velvet',
    nameFr: 'Cookie Red Velvet',
    nameAr: 'كوكيز ريد فيلفيت',
    descEn: 'Velvety red cookie with a gooey marshmallow center and cream cheese frosting.',
    descFr: 'Cookie rouge velouté avec cœur fondant de marshmallow et glaçage au fromage frais.',
    descAr: 'كوكيز مخملي أحمر بقلب مارشميلو ذائب وطلاء جبن الكريم.',
    price: 4.0,
    inStock: true,
    badge: 'new',
  },
  {
    id: '4',
    slug: 'kunafa-pistachio',
    emoji: '💚',
    images: ['/pistachio-ext.jpg', '/pistachio-int.jpg'],
    nameEn: 'Kunafa Pistachio',
    nameFr: 'Cookie Konafa Pistache',
    nameAr: 'كوكيز كنافة بالفستق',
    descEn: 'Cookie inspired by kunafa with crunchy pistachio filling.',
    descFr: 'Cookie inspiré de la konafa avec une garniture croquante à la pistache.',
    descAr: 'كوكيز مستوحى من الكنافة بحشوة الفستق المقرمشة.',
    price: 5.0,
    inStock: true,
    badge: 'bestseller',
  },
  {
    id: '5',
    slug: 'praline-amande',
    emoji: '🌰',
    images: ['/praline-ext.jpg', '/praline-int.jpg'],
    nameEn: 'Praline Almond',
    nameFr: 'Cookie Praliné Amande',
    nameAr: 'كوكيز براليني اللوز',
    descEn: 'Crunchy almond praline cookie with caramelized nuts.',
    descFr: 'Cookie au praliné d\'amandes avec des noix caramélisées.',
    descAr: 'كوكيز براليني اللوز مع المكسرات المكرملة.',
    price: 4.5,
    inStock: true,
  },
  {
    id: '6',
    slug: 'lotus',
    emoji: '🌺',
    images: ['/lotus-ext.jpg', '/lotus-int.jpg'],
    nameEn: 'Lotus Biscoff',
    nameFr: 'Cookie Lotus',
    nameAr: 'كوكيز لوتس',
    descEn: 'Cookie loaded with Lotus Biscoff spread and caramelized biscuit pieces.',
    descFr: 'Cookie généreusement garni de pâte Lotus et morceaux de biscuits caramélisés.',
    descAr: 'كوكيز محشو بكريمة لوتس وقطع البسكويت المكرمل.',
    price: 4.5,
    inStock: true,
    badge: 'bestseller',
  },
  {
    id: '7',
    slug: 'nutella-noix',
    emoji: '🍫',
    images: ['/nutella-ext.jpg', '/nutella-int.jpg'],
    nameEn: 'Nutella & Walnut',
    nameFr: 'Cookie Nutella & Noix',
    nameAr: 'كوكيز نوتيلا والجوز',
    descEn: 'Gooey Nutella-filled cookie with crunchy walnut pieces.',
    descFr: 'Cookie fondant fourré au Nutella avec des éclats de noix croquants.',
    descAr: 'كوكيز طري محشو بالنوتيلا مع قطع الجوز المقرمشة.',
    price: 4.0,
    inStock: true,
    badge: 'new',
  },
];

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
