-- =============================================
-- SWEET BY SISTER — Migration : renommage de 3 cookies (FR/EN/AR)
-- Sûr à exécuter sur la base de PRODUCTION :
--  - Uniquement des UPDATE sur les colonnes name_en/name_fr/name_ar.
--  - Ne touche à aucune autre table ni ligne existante.
-- Colle ce script dans Supabase > SQL Editor puis "Run".
-- =============================================

update products set
  name_en = 'Hazelnut & Kinder Bueno',
  name_fr = 'Cookie Noisette & Kinder Bueno',
  name_ar = 'كوكيز البندق وكيندر بوينو'
where id = '2'; -- ex "Kinder Bueno"

update products set
  name_en = 'Red Velvet Praline & Marshmallow',
  name_fr = 'Cookie Red Velvet Praliné & Marshmallow',
  name_ar = 'كوكيز ريد فيلفيت براليني ومارشميلو'
where id = '3'; -- ex "Red Velvet"

update products set
  name_en = 'Hazelnut & Biscoff',
  name_fr = 'Cookie Noisette & Biscoff',
  name_ar = 'كوكيز البندق وبسكوف'
where id = '6'; -- ex "Lotus Biscoff"
