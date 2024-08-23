/*
  Warnings:

  - You are about to drop the column `type_plan_id` on the `OptionTypePlan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OptionTypePlan" DROP CONSTRAINT "OptionTypePlan_type_plan_id_fkey";

-- AlterTable
ALTER TABLE "OptionTypePlan" DROP COLUMN "type_plan_id";

-- CreateTable
CREATE TABLE "TypePlanONOptionTypePlan" (
    "typePlanId" INTEGER NOT NULL,
    "optionTypePlanId" INTEGER NOT NULL,

    CONSTRAINT "TypePlanONOptionTypePlan_pkey" PRIMARY KEY ("typePlanId","optionTypePlanId")
);

-- AddForeignKey
ALTER TABLE "TypePlanONOptionTypePlan" ADD CONSTRAINT "TypePlanONOptionTypePlan_typePlanId_fkey" FOREIGN KEY ("typePlanId") REFERENCES "TypePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypePlanONOptionTypePlan" ADD CONSTRAINT "TypePlanONOptionTypePlan_optionTypePlanId_fkey" FOREIGN KEY ("optionTypePlanId") REFERENCES "OptionTypePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
