/*
  Warnings:

  - You are about to drop the `OptionTypePlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypePlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypePlanONOptionTypePlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_type_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "TypePlanONOptionTypePlan" DROP CONSTRAINT "TypePlanONOptionTypePlan_optionTypePlanId_fkey";

-- DropForeignKey
ALTER TABLE "TypePlanONOptionTypePlan" DROP CONSTRAINT "TypePlanONOptionTypePlan_typePlanId_fkey";

-- DropTable
DROP TABLE "OptionTypePlan";

-- DropTable
DROP TABLE "TypePlan";

-- DropTable
DROP TABLE "TypePlanONOptionTypePlan";

-- CreateTable
CREATE TABLE "PlansByType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "isSelect" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlansByType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionForPlans" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptionForPlans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlansByTypeONOptionForPlans" (
    "plansByTypeId" INTEGER NOT NULL,
    "optionForPlansId" INTEGER NOT NULL,

    CONSTRAINT "PlansByTypeONOptionForPlans_pkey" PRIMARY KEY ("plansByTypeId","optionForPlansId")
);

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_type_plan_id_fkey" FOREIGN KEY ("type_plan_id") REFERENCES "PlansByType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlansByTypeONOptionForPlans" ADD CONSTRAINT "PlansByTypeONOptionForPlans_plansByTypeId_fkey" FOREIGN KEY ("plansByTypeId") REFERENCES "PlansByType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlansByTypeONOptionForPlans" ADD CONSTRAINT "PlansByTypeONOptionForPlans_optionForPlansId_fkey" FOREIGN KEY ("optionForPlansId") REFERENCES "OptionForPlans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
