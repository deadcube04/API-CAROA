/*
  Warnings:

  - Made the column `size` on table `CartItem` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CartItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "size" TEXT NOT NULL
);
INSERT INTO "new_CartItem" ("cartId", "id", "productId", "quantity", "size") SELECT "cartId", "id", "productId", "quantity", "size" FROM "CartItem";
DROP TABLE "CartItem";
ALTER TABLE "new_CartItem" RENAME TO "CartItem";
CREATE UNIQUE INDEX "CartItem_cartId_key" ON "CartItem"("cartId");
CREATE UNIQUE INDEX "CartItem_productId_key" ON "CartItem"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
