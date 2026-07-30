-- =============================================
-- SWEET BY SISTER — Migration : catalogue réel + colonne images
-- Sûr à exécuter sur la base de PRODUCTION :
--  - N'utilise que ALTER TABLE ADD COLUMN IF NOT EXISTS et INSERT ... ON CONFLICT.
--  - Ne touche jamais à la table "orders" (aucune commande cliente n'est modifiée).
--  - Peut être rejoué plusieurs fois sans risque (idempotent).
-- Colle ce script dans Supabase > SQL Editor puis "Run".
-- =============================================

-- 1. Colonne images (chemins publics, ex: '/triple-choc-ext.jpg')
alter table products add column if not exists images jsonb not null default '[]'::jsonb;

-- 2. Remplace le contenu des 6 anciens produits (id 1-6) et ajoute le 7e,
--    pour que la table corresponde exactement à ce qui est affiché sur le site.
insert into products (id, slug, emoji, images, name_en, name_fr, name_ar, desc_en, desc_fr, desc_ar, price, in_stock, badge, sort_order) values
('1', 'triple-chocolate', '🍫', '["/triple-choc-ext.jpg","/triple-choc-int.jpg"]',
 'Triple Chocolate', 'Cookie Triple Chocolat', 'كوكيز ثلاثي الشوكولاتة',
 'Dark, milk and white chocolate chunks in one irresistible cookie.',
 'Chocolat noir, au lait et blanc réunis dans un cookie irrésistible.',
 'شوكولاتة داكنة وحليب وبيضاء في كوكيز لا يُقاوم.',
 20, true, 'bestseller', 1),
('2', 'kinder-bueno', '🤎', '["/kinder-ext.jpg","/kinder-int.jpg"]',
 'Kinder Bueno', 'Cookie Kinder Bueno', 'كوكيز كيندر بوينو',
 'Soft cookie filled with authentic Kinder Bueno cream, topped with crunchy hazelnuts and Bueno pieces.',
 'Cookie moelleux fourré à la vraie crème de Kinder Bueno, garni de noisettes croquantes et morceaux de Bueno.',
 'كوكيز طري محشو بكريمة كيندر بوينو الأصلية مع البندق المقرمش وقطع البوينو.',
 22, true, 'new', 2),
('3', 'red-velvet', '❤️', '["/redvelvet-ext.jpg","/redvelvet-int.jpg"]',
 'Red Velvet', 'Cookie Red Velvet', 'كوكيز ريد فيلفيت',
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
 'Lotus Biscoff', 'Cookie Lotus', 'كوكيز لوتس',
 'Cookie loaded with Lotus Biscoff spread and caramelized biscuit pieces.',
 'Cookie généreusement garni de pâte Lotus et morceaux de biscuits caramélisés.',
 'كوكيز محشو بكريمة لوتس وقطع البسكويت المكرمل.',
 22, true, 'bestseller', 6),
('7', 'nutella-noix', '🍫', '["/nutella-ext.jpg","/nutella-int.jpg"]',
 'Nutella & Walnut', 'Cookie Nutella & Noix', 'كوكيز نوتيلا والجوز',
 'Gooey Nutella-filled cookie with crunchy walnut pieces.',
 'Cookie fondant fourré au Nutella avec des éclats de noix croquants.',
 'كوكيز طري محشو بالنوتيلا مع قطع الجوز المقرمشة.',
 20, true, 'new', 7)
on conflict (id) do update set
  slug       = excluded.slug,
  emoji      = excluded.emoji,
  images     = excluded.images,
  name_en    = excluded.name_en,
  name_fr    = excluded.name_fr,
  name_ar    = excluded.name_ar,
  desc_en    = excluded.desc_en,
  desc_fr    = excluded.desc_fr,
  desc_ar    = excluded.desc_ar,
  price      = excluded.price,
  in_stock   = excluded.in_stock,
  badge      = excluded.badge,
  sort_order = excluded.sort_order;

-- 3. Prix des packs : voir supabase-migration-mad-prices.sql (prix en MAD).

-- Note sécurité : aucune policy d'écriture publique n'est ajoutée pour "products"/"packs".
-- Les écritures admin passent désormais par /api/admin/products, qui utilise
-- SUPABASE_SERVICE_ROLE_KEY côté serveur (contourne RLS) après vérification du mot de passe admin.
