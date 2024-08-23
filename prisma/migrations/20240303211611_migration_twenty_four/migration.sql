/*
  Warnings:

  - You are about to drop the `claimed_bonuse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "claimed_bonuse" DROP CONSTRAINT "claimed_bonuse_referral_id_fkey";

-- DropTable
DROP TABLE "claimed_bonuse";

-- CreateTable
CREATE TABLE "claimed_bonuses" (
    "id" SERIAL NOT NULL,
    "referral_id" INTEGER NOT NULL,
    "discount" INTEGER,
    "additional_generations" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claimed_bonuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "claimed_bonuses_referral_id_key" ON "claimed_bonuses"("referral_id");

-- AddForeignKey
ALTER TABLE "claimed_bonuses" ADD CONSTRAINT "claimed_bonuses_referral_id_fkey" FOREIGN KEY ("referral_id") REFERENCES "Referral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
