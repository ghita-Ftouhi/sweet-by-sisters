-- =============================================
-- SWEET BY SISTER — Supabase Database Setup
-- Colle ce script dans Supabase > SQL Editor
-- =============================================

-- 1. PRODUCTS
create table if not exists products (
  id          text primary key,
  slug        text not null,
  emoji       text not null,
  images      jsonb not null default '[]'::jsonb,
  name_en     text not null,
  name_fr     text not null,
  name_ar     text not null,
  desc_en     text not null,
  desc_fr     text not null,
  desc_ar     text not null,
  price       numeric(6,2) not null,
  in_stock    boolean not null default true,
  badge       text,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- 2. PACKS
create table if not exists packs (
  id             text primary key,
  emoji          text not null,
  name_en        text not null,
  name_fr        text not null,
  name_ar        text not null,
  desc_en        text not null,
  desc_fr        text not null,
  desc_ar        text not null,
  size           int not null,
  price          numeric(6,2) not null,
  original_price numeric(6,2) not null,
  badge          text,
  badge_color    text,
  popular        boolean default false,
  active         boolean default true,
  sort_order     int default 0
);

-- 3. ORDERS
create table if not exists orders (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz default now(),
  status         text not null default 'pending',
  total          numeric(8,2) not null,
  payment_method text not null,
  locale         text default 'fr',
  customer_note  text,
  items          jsonb not null default '[]'
);
-- status values: pending | preparing | ready | delivered | cancelled

-- =============================================
-- SEED: Initial products data
-- =============================================
insert into products (id, slug, emoji, images, name_en, name_fr, name_ar, desc_en, desc_fr, desc_ar, price, in_stock, badge, sort_order) values
('1', 'triple-chocolate', '🍫', '["/triple-choc-ext.jpg","/triple-choc-int.jpg"]',
 'Triple Chocolate', 'Cookie Triple Chocolat', 'كوكيز ثلاثي الشوكولاتة',
 'Dark, milk and white chocolate chunks in one irresistible cookie.',
 'Chocolat noir, au lait et blanc réunis dans un cookie irrésistible.',
 'شوكولاتة داكنة وحليب وبيضاء في كوكيز لا يُقاوم.',
 20, true, 'bestseller', 1),
('2', 'kinder-bueno', '🤎', '["/kinder-ext.jpg","/kinder-int.jpg"]',
 'Hazelnut & Kinder Bueno', 'Cookie Noisette & Kinder Bueno', 'كوكيز البندق وكيندر بوينو',
 'Soft cookie filled with authentic Kinder Bueno cream, topped with crunchy hazelnuts and Bueno pieces.',
 'Cookie moelleux fourré à la vraie crème de Kinder Bueno, garni de noisettes croquantes et morceaux de Bueno.',
 'كوكيز طري محشو بكريمة كيندر بوينو الأصلية مع البندق المقرمش وقطع البوينو.',
 22, true, 'new', 2),
('3', 'red-velvet', '❤️', '["/redvelvet-ext.jpg","/redvelvet-int.jpg"]',
 'Red Velvet Praline & Marshmallow', 'Cookie Red Velvet Praliné & Marshmallow', 'كوكيز ريد فيلفيت براليني ومارشميلو',
 'Velvety red cookie with a gooey marshmallow center and cream cheese frosting.',
 'Cookie rouge velouté avec cœur fondant de marshmallow et glaçage au fromage frais.',
 'كوكيز مخملي أحمر بقلب مارشميلو ذائب وطلاء جبن الكريم.',
 22, true, 'new', 3),
('4', 'kunafa-pistachio', '💚', '["/pistachio-ext.jpg","/pistachio-int.jpg"]',
 'Kunafa Pistachio', 'Cookie Konafa Pistache', 'كوكيز كنافة بالفستق',
 'Cookie inspired by kunafa with crunchy pistachio filling.',
 'Cookie inspiré de la konafa avec une garniture croquante à la pistache.',
 'كوكيز مستوحى من الكنافة بحشوة الفستق المقرمشة.',
 22, true, 'bestseller', 4),
('5', 'praline-amande', '🌰', '["/praline-ext.jpg","/praline-int.jpg"]',
 'Praline Almond', 'Cookie Praliné Amande', 'كوكيز براليني اللوز',
 'Crunchy almond praline cookie with caramelized nuts.',
 'Cookie au praliné d''amandes avec des noix caramélisées.',
 'كوكيز براليني اللوز مع المكسرات المكرملة.',
 22, true, null, 5),
('6', 'lotus', '🌺', '["/lotus-ext.jpg","/lotus-int.jpg"]',
 'Hazelnut & Biscoff', 'Cookie Noisette & Biscoff', 'كوكيز البندق وبسكوف',
 'Cookie loaded with Lotus Biscoff spread and caramelized biscuit pieces.',
 'Cookie généreusement garni de pâte Lotus et morceaux de biscuits caramélisés.',
 'كوكيز محشو بكريمة لوتس وقطع البسكويت المكرمل.',
 22, true, 'bestseller', 6),
('7', 'nutella-noix', '🍫', '["/nutella-ext.jpg","/nutella-int.jpg"]',
 'Nutella & Walnut', 'Cookie Nutella & Noix', 'كوكيز نوتيلا والجوز',
 'Gooey Nutella-filled cookie with crunchy walnut pieces.',
 'Cookie fondant fourré au Nutella avec des éclats de noix croquants.',
 'كوكيز طري محشو بالنوتيلا مع قطع الجوز المقرمشة.',
 20, true, 'new', 7),
('8', 'mms-cookie', '🍬', '["/mm-ext.jpg","/mm-int.jpg"]',
 'M&M''s Cookie', 'Cookie M&M''s', 'كوكيز إم أند إمز',
 'Soft cookie loaded with colorful M&M''s for a fun, crunchy bite.',
 'Cookie moelleux généreusement garni de M&M''s colorés pour une touche croquante et fun.',
 'كوكيز طري مليء بحبات إم أند إمز الملونة لقضمة مقرمشة ومرحة.',
 22, true, 'new', 8)
on conflict (id) do nothing;

-- =============================================
-- SEED: Initial packs data
-- =============================================
insert into packs (id, emoji, name_en, name_fr, name_ar, desc_en, desc_fr, desc_ar, size, price, original_price, badge, badge_color, popular, sort_order) values
('pack-6', '🎀', 'Discovery Box', 'Box Découverte', 'صندوق الاكتشاف',
 'Perfect for trying our flavors. 6 cookies of your choice.',
 'Parfait pour découvrir nos saveurs. 6 cookies de votre choix.',
 'مثالي لتجربة نكهاتنا. 6 كوكيز من اختيارك.',
 6, 126, 132, 'Populaire', 'bg-rose-main', true, 1),
('pack-12', '💝', 'Gourmet Box', 'Box Gourmande', 'صندوق الذواقة',
 'The perfect gift box. 12 cookies of your choice.',
 'La boîte cadeau parfaite. 12 cookies de votre choix.',
 'صندوق الهدايا المثالي. 12 كوكيز من اختيارك.',
 12, 240, 264, 'Meilleur choix', 'bg-gold', false, 2),
('pack-18', '👨‍👩‍👧‍👦', 'Family Box', 'Box Famille', 'صندوق العائلة',
 'Made to share! 18 cookies of your choice.',
 'Fait pour partager ! 18 cookies de votre choix.',
 'صُنع للمشاركة! 18 كوكيز من اختيارك.',
 18, 342, 396, 'Meilleure valeur', 'bg-plum', false, 3)
on conflict (id) do nothing;

-- =============================================
-- Enable Row Level Security (lecture publique)
-- =============================================
alter table products enable row level security;
alter table packs enable row level security;
alter table orders enable row level security;

create policy "Public read products" on products for select using (true);
create policy "Public read packs" on packs for select using (true);
create policy "Insert orders" on orders for insert with check (true);
create policy "Public read orders" on orders for select using (true);
create policy "Update orders" on orders for update using (true);
