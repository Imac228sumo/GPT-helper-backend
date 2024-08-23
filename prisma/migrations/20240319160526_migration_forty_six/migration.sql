/*
  Warnings:

  - You are about to drop the column `type_plan_id` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the `OptionForPlans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlanTool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlansByType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlansByTypeONOptionForPlans` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_type_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "PlanTool" DROP CONSTRAINT "PlanTool_planId_fkey";

-- DropForeignKey
ALTER TABLE "PlanTool" DROP CONSTRAINT "PlanTool_toolId_fkey";

-- DropForeignKey
ALTER TABLE "PlansByTypeONOptionForPlans" DROP CONSTRAINT "PlansByTypeONOptionForPlans_optionForPlansId_fkey";

-- DropForeignKey
ALTER TABLE "PlansByTypeONOptionForPlans" DROP CONSTRAINT "PlansByTypeONOptionForPlans_plansByTypeId_fkey";

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "type_plan_id",
ADD COLUMN     "type_of_plans_id" INTEGER;

-- DropTable
DROP TABLE "OptionForPlans";

-- DropTable
DROP TABLE "PlanTool";

-- DropTable
DROP TABLE "PlansByType";

-- DropTable
DROP TABLE "PlansByTypeONOptionForPlans";

-- CreateTable
CREATE TABLE "OptionForPlan" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "descriptions" TEXT NOT NULL,
    "information" TEXT NOT NULL,
    "subOptions" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptionForPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanONOptionForPlan" (
    "planId" INTEGER NOT NULL,
    "optionForPlanId" INTEGER NOT NULL,

    CONSTRAINT "PlanONOptionForPlan_pkey" PRIMARY KEY ("planId","optionForPlanId")
);

-- CreateTable
CREATE TABLE "PlanONTool" (
    "planId" INTEGER NOT NULL,
    "toolId" INTEGER NOT NULL,

    CONSTRAINT "PlanONTool_pkey" PRIMARY KEY ("planId","toolId")
);

-- CreateTable
CREATE TABLE "TypeOfPlans" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "isSelect" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TypeOfPlans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionForTypeOfPlan" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptionForTypeOfPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeOfPlansONOptionForTypeOfPlan" (
    "typeOfPlansId" INTEGER NOT NULL,
    "optionForTypeOfPlanId" INTEGER NOT NULL,

    CONSTRAINT "TypeOfPlansONOptionForTypeOfPlan_pkey" PRIMARY KEY ("typeOfPlansId","optionForTypeOfPlanId")
);

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_type_of_plans_id_fkey" FOREIGN KEY ("type_of_plans_id") REFERENCES "TypeOfPlans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanONOptionForPlan" ADD CONSTRAINT "PlanONOptionForPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanONOptionForPlan" ADD CONSTRAINT "PlanONOptionForPlan_optionForPlanId_fkey" FOREIGN KEY ("optionForPlanId") REFERENCES "OptionForPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanONTool" ADD CONSTRAINT "PlanONTool_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanONTool" ADD CONSTRAINT "PlanONTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeOfPlansONOptionForTypeOfPlan" ADD CONSTRAINT "TypeOfPlansONOptionForTypeOfPlan_typeOfPlansId_fkey" FOREIGN KEY ("typeOfPlansId") REFERENCES "TypeOfPlans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeOfPlansONOptionForTypeOfPlan" ADD CONSTRAINT "TypeOfPlansONOptionForTypeOfPlan_optionForTypeOfPlanId_fkey" FOREIGN KEY ("optionForTypeOfPlanId") REFERENCES "OptionForTypeOfPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
