/*
  Warnings:

  - You are about to drop the column `claimed_bonuses` on the `Referral` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Referral" DROP COLUMN "claimed_bonuses";

-- CreateTable
CREATE TABLE "claimed_bonuse" (
    "id" SERIAL NOT NULL,
    "referral_id" INTEGER NOT NULL,
    "discount" INTEGER,
    "additional_generations" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claimed_bonuse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "claimed_bonuse_referral_id_key" ON "claimed_bonuse"("referral_id");

-- AddForeignKey
ALTER TABLE "claimed_bonuse" ADD CONSTRAINT "claimed_bonuse_referral_id_fkey" FOREIGN KEY ("referral_id") REFERENCES "Referral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
