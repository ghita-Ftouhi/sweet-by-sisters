-- =============================================
-- SWEET BY SISTER — Migration : ajout du Cookie M&M's
-- Sûr à exécuter sur la base de PRODUCTION :
--  - Un seul INSERT ... ON CONFLICT DO NOTHING (nouveau produit, id '8').
--  - Ne touche à aucune autre table ni ligne existante.
-- Colle ce script dans Supabase > SQL Editor puis "Run".
-- =============================================

insert into products (id, slug, emoji, images, name_en, name_fr, name_ar, desc_en, desc_fr, desc_ar, price, in_stock, badge, sort_order) values
('8', 'mms-cookie', '🍬', '["/mm-ext.jpg","/mm-int.jpg"]',
 'M&M''s Cookie', 'Cookie M&M''s', 'كوكيز إم أند إمز',
 'Soft cookie loaded with colorful M&M''s for a fun, crunchy bite.',
 'Cookie moelleux généreusement garni de M&M''s colorés pour une touche croquante et fun.',
 'كوكيز طري مليء بحبات إم أند إمز الملونة لقضمة مقرمشة ومرحة.',
 22, true, 'new', 8)
on conflict (id) do nothing;
