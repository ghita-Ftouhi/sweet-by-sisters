-- =============================================
-- SWEET BY SISTER — Migration : ajout Cookie Pops & Cookie Fries
-- Sûr à exécuter sur la base de PRODUCTION :
--  - ADD COLUMN IF NOT EXISTS puis INSERT ... ON CONFLICT DO NOTHING.
--  - Ne touche à aucune autre table ni ligne existante.
-- Colle ce script dans Supabase > SQL Editor puis "Run".
-- =============================================

-- 1. Colonne pour exclure certains produits du composeur de box (6/12/18 cookies)
alter table products add column if not exists box_eligible boolean not null default true;

-- 2. Nouveaux produits (vendus au sachet/boîte, pas à l'unité — exclus du composeur de box)
insert into products (id, slug, emoji, images, name_en, name_fr, name_ar, desc_en, desc_fr, desc_ar, price, in_stock, badge, sort_order, box_eligible) values
('9', 'cookie-pops', '🍪', '[]',
 'Cookie Pops', 'Cookie Pops', 'كوكيز بوبس',
 '500g box of soft bite-sized cookie pieces, served with chocolate dip — perfect for sharing or snacking anytime.',
 'Boîte de 500g de petites bouchées de cookie moelleuses, servies avec une sauce chocolat, parfaites à grignoter ou à partager.',
 'علبة 500 جرام من قطع الكوكيز الصغيرة الطرية، تُقدَّم مع صوص الشوكولاتة، مثالية للمشاركة أو الاستمتاع بها في أي وقت.',
 50, true, 'new', 9, false),
('10', 'cookie-fries', '🍟', '[]',
 'Cookie Fries', 'Cookie Fries', 'كوكيز فرايز',
 '200g bag of cookie fries, crispy outside and soft inside, served with chocolate dip.',
 'Sachet de 200g de cookies en forme de frites, croustillants à l''extérieur et moelleux à l''intérieur, servis avec une sauce chocolat.',
 'كيس 200 جرام من الكوكيز على شكل أصابع، مقرمش من الخارج وطري من الداخل، يُقدَّم مع صوص الشوكولاتة.',
 25, true, 'new', 10, false)
on conflict (id) do nothing;
