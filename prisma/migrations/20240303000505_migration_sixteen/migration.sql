/*
  Warnings:

  - You are about to drop the column `slug` on the `Subscription` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Subscription_slug_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "slug";
