/*
  Warnings:

  - Made the column `image` on table `OrderItem` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `largeImage` on table `OrderItem` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "largeImage" SET NOT NULL;
