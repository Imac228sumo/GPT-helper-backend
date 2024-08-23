/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referred_by_user_id` to the `Referral` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Referral" ADD COLUMN     "referred_by_user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Referral_user_id_key" ON "Referral"("user_id");

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referred_by_user_id_fkey" FOREIGN KEY ("referred_by_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
