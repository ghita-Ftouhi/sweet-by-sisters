-- =============================================
-- SWEET BY SISTER — Migration : prix en MAD (Dirham marocain)
-- Sûr à exécuter sur la base de PRODUCTION :
--  - Uniquement des UPDATE sur des colonnes de prix existantes.
--  - Ne touche jamais à la table "orders".
--  - Peut être rejoué plusieurs fois sans risque (idempotent).
-- Colle ce script dans Supabase > SQL Editor puis "Run".
-- =============================================

-- 1. Prix des cookies (MAD)
update products set price = 20 where id = '1'; -- Triple Chocolat
update products set price = 22 where id = '2'; -- Kinder Bueno
update products set price = 22 where id = '3'; -- Red Velvet
update products set price = 22 where id = '4'; -- Konafa Pistache
update products set price = 22 where id = '5'; -- Praliné Amande
update products set price = 22 where id = '6'; -- Lotus
update products set price = 20 where id = '7'; -- Nutella & Noix

-- 2. Prix des packs (MAD)
update packs set price = 120, original_price = 132 where id = 'pack-6';  -- Box Découverte
update packs set price = 240, original_price = 264 where id = 'pack-12'; -- Box Gourmande
update packs set price = 360, original_price = 396 where id = 'pack-18'; -- Box Famille
