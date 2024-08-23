/*
  Warnings:

  - You are about to drop the column `expiration_date` on the `Plan` table. All the data in the column will be lost.
  - Added the required column `quantity_of_days` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "expiration_date",
ADD COLUMN     "quantity_of_days" INTEGER NOT NULL;
