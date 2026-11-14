-- =====================================================================
-- QuickEats · Creación de todas las tablas en un proyecto NUEVO de Supabase
-- ---------------------------------------------------------------------
-- Cómo usarlo: Supabase → Editor SQL → New query → pegar TODO → Run.
-- Ejecutar UNA sola vez sobre una base vacía.
--
-- Por qué un script y no `prisma db push`: auth-service y order-service
-- comparten el esquema `public`; si se hace `db push` desde cada servicio,
-- el segundo borra las tablas del primero. Este script crea todo junto,
-- con los mismos nombres y tipos que generan los schema.prisma.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1) auth-service  (esquema public)  → auth-service/prisma/schema.prisma
-- ---------------------------------------------------------------------
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

CREATE TABLE "User" (
    "id"        TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "email"     TEXT NOT NULL,
    "password"  TEXT NOT NULL,
    "role"      "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");


-- ---------------------------------------------------------------------
-- 2) restaurant-service  (esquema restaurant_service)
-- ---------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS "restaurant_service";

CREATE TABLE "restaurant_service"."Restaurant" (
    "id"           TEXT NOT NULL,
    "name"         TEXT NOT NULL,
    "description"  TEXT NOT NULL,
    "category"     TEXT NOT NULL,
    "address"      TEXT NOT NULL,
    "deliveryTime" INTEGER NOT NULL,
    "deliveryFee"  DOUBLE PRECISION NOT NULL,
    "isOpen"       BOOLEAN NOT NULL DEFAULT true,
    "isFeatured"   BOOLEAN NOT NULL DEFAULT false,
    "image"        TEXT NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "restaurant_service"."OpeningHour" (
    "id"           TEXT NOT NULL,
    "dayOfWeek"    INTEGER NOT NULL,
    "openTime"     TEXT NOT NULL,
    "closeTime"    TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "OpeningHour_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "restaurant_service"."Product" (
    "id"           TEXT NOT NULL,
    "name"         TEXT NOT NULL,
    "description"  TEXT NOT NULL,
    "price"        DOUBLE PRECISION NOT NULL,
    "category"     TEXT NOT NULL DEFAULT 'General',
    "calories"     INTEGER,
    "image"        TEXT NOT NULL,
    "isAvailable"  BOOLEAN NOT NULL DEFAULT true,
    "isPopular"    BOOLEAN NOT NULL DEFAULT false,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "restaurant_service"."OpeningHour"
    ADD CONSTRAINT "OpeningHour_restaurantId_fkey" FOREIGN KEY ("restaurantId")
    REFERENCES "restaurant_service"."Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "restaurant_service"."Product"
    ADD CONSTRAINT "Product_restaurantId_fkey" FOREIGN KEY ("restaurantId")
    REFERENCES "restaurant_service"."Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- ---------------------------------------------------------------------
-- 3) order-service  (esquema public)
-- ---------------------------------------------------------------------
CREATE TABLE "Order" (
    "id"             TEXT NOT NULL,
    "userId"         TEXT NOT NULL,
    "restaurantId"   TEXT NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "address"        TEXT NOT NULL,
    "deliveryNotes"  TEXT,
    "paymentMethod"  TEXT NOT NULL,
    "subtotal"       DOUBLE PRECISION NOT NULL,
    "deliveryFee"    DOUBLE PRECISION NOT NULL,
    "total"          DOUBLE PRECISION NOT NULL,
    "status"         TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrderItem" (
    "id"        TEXT NOT NULL,
    "orderId"   TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "price"     DOUBLE PRECISION NOT NULL,
    "quantity"  INTEGER NOT NULL,
    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId")
    REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- ---------------------------------------------------------------------
-- 4) notification-service  (esquema notification_service)
-- ---------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS "notification_service";

CREATE TABLE "notification_service"."Notification" (
    "id"        TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "message"   TEXT NOT NULL,
    "isRead"    BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);


-- ---------------------------------------------------------------------
-- 5) Seguridad: activar RLS en TODAS las tablas.
--    Los microservicios se conectan con el usuario `postgres`, que ignora
--    RLS, así que siguen funcionando igual. Lo que se bloquea es el acceso
--    directo desde internet con la clave pública (anon) de Supabase, que
--    va incluida en el frontend. Sin esto, cualquiera podría leer la tabla
--    "User" (correos y contraseñas cifradas) por la API de Supabase.
-- ---------------------------------------------------------------------
ALTER TABLE "User"                                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order"                                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem"                            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "restaurant_service"."Restaurant"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "restaurant_service"."OpeningHour"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "restaurant_service"."Product"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notification_service"."Notification"  ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------
-- 6) Tiempo real del catálogo (opcional pero recomendado).
--    El catálogo del cliente escucha cambios de la tabla Restaurant para
--    actualizarse al instante (si no, igual se actualiza cada 10 s).
--    Solo se permite LEER restaurantes, que es información pública.
-- ---------------------------------------------------------------------
GRANT USAGE  ON SCHEMA "restaurant_service"               TO anon, authenticated;
GRANT SELECT ON "restaurant_service"."Restaurant"         TO anon, authenticated;

CREATE POLICY "Lectura publica de restaurantes"
    ON "restaurant_service"."Restaurant"
    FOR SELECT TO anon, authenticated
    USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE "restaurant_service"."Restaurant";


-- ---------------------------------------------------------------------
-- 7) Verificación: debe listar 7 tablas.
-- ---------------------------------------------------------------------
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_name IN ('User','Order','OrderItem','Restaurant','OpeningHour','Product','Notification')
ORDER BY table_schema, table_name;
