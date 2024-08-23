/*
  Warnings:

  - You are about to drop the `FreeSubscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FreeSubscription" DROP CONSTRAINT "FreeSubscription_userId_fkey";

-- DropTable
DROP TABLE "FreeSubscription";
