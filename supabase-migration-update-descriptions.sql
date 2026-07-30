-- =============================================
-- SWEET BY SISTER — Migration : mise à jour des descriptions
-- (pour les 3 cookies renommés : Kinder Bueno, Red Velvet, Lotus)
-- Sûr à exécuter sur la base de PRODUCTION :
--  - Uniquement des UPDATE sur les colonnes desc_en/desc_fr/desc_ar.
--  - Ne touche à aucune autre table ni ligne existante.
-- Colle ce script dans Supabase > SQL Editor puis "Run".
-- =============================================

update products set
  desc_en = 'Soft cookie with crunchy hazelnuts, filled with authentic Kinder Bueno cream and Bueno pieces.',
  desc_fr = 'Cookie moelleux aux noisettes croquantes, fourré à la vraie crème de Kinder Bueno et morceaux de Bueno.',
  desc_ar = 'كوكيز طري بالبندق المقرمش، محشو بكريمة كيندر بوينو الأصلية وقطع البوينو.'
where id = '2'; -- Noisette & Kinder Bueno

update products set
  desc_en = 'Velvety red praline cookie with a gooey marshmallow center and cream cheese frosting.',
  desc_fr = 'Cookie rouge velouté au praliné, avec cœur fondant de marshmallow et glaçage au fromage frais.',
  desc_ar = 'كوكيز ريد فيلفيت بالبراليني، بقلب مارشميلو ذائب وطلاء جبن الكريم.'
where id = '3'; -- Red Velvet Praliné & Marshmallow

update products set
  desc_en = 'Cookie topped with crunchy hazelnuts and Biscoff spread, finished with Biscoff biscuit pieces.',
  desc_fr = 'Cookie garni de noisettes croquantes et de pâte Biscoff, surmonté d''éclats de biscuits Biscoff.',
  desc_ar = 'كوكيز مزين بالبندق المقرمش وكريمة بسكوف، مع قطع بسكويت بسكوف من الأعلى.'
where id = '6'; -- Noisette & Biscoff
