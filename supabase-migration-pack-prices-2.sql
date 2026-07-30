-- =============================================
-- SWEET BY SISTER — Migration : ajustement des prix des packs (MAD)
-- Sûr à exécuter sur la base de PRODUCTION :
--  - Uniquement des UPDATE sur des colonnes de prix existantes.
--  - Ne touche jamais à la table "orders".
--  - Peut être rejoué plusieurs fois sans risque (idempotent).
-- Colle ce script dans Supabase > SQL Editor puis "Run".
-- =============================================

update packs set price = 126, original_price = 132 where id = 'pack-6';  -- Discovery Box (-5%)
update packs set price = 240, original_price = 264 where id = 'pack-12'; -- Gourmet Box (-9%, inchangé)
update packs set price = 342, original_price = 396 where id = 'pack-18'; -- Family Box (-14%)
