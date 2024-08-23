/*
  Warnings:

  - You are about to drop the `OptionForTypeOfPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypeOfPlansONOptionForTypeOfPlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TypeOfPlansONOptionForTypeOfPlan" DROP CONSTRAINT "TypeOfPlansONOptionForTypeOfPlan_optionForTypeOfPlanId_fkey";

-- DropForeignKey
ALTER TABLE "TypeOfPlansONOptionForTypeOfPlan" DROP CONSTRAINT "TypeOfPlansONOptionForTypeOfPlan_typeOfPlansId_fkey";

-- DropTable
DROP TABLE "OptionForTypeOfPlan";

-- DropTable
DROP TABLE "TypeOfPlansONOptionForTypeOfPlan";

-- CreateTable
CREATE TABLE "OptionForTypeOfPlans" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptionForTypeOfPlans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeOfPlansONOptionForTypeOfPlans" (
    "typeOfPlansId" INTEGER NOT NULL,
    "optionForTypeOfPlansId" INTEGER NOT NULL,

    CONSTRAINT "TypeOfPlansONOptionForTypeOfPlans_pkey" PRIMARY KEY ("typeOfPlansId","optionForTypeOfPlansId")
);

-- AddForeignKey
ALTER TABLE "TypeOfPlansONOptionForTypeOfPlans" ADD CONSTRAINT "TypeOfPlansONOptionForTypeOfPlans_typeOfPlansId_fkey" FOREIGN KEY ("typeOfPlansId") REFERENCES "TypeOfPlans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeOfPlansONOptionForTypeOfPlans" ADD CONSTRAINT "TypeOfPlansONOptionForTypeOfPlans_optionForTypeOfPlansId_fkey" FOREIGN KEY ("optionForTypeOfPlansId") REFERENCES "OptionForTypeOfPlans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
