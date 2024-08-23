/*
  Warnings:

  - You are about to drop the column `plan_id` on the `Plan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_plan_id_fkey";

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "plan_id",
ADD COLUMN     "type_plan_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_type_plan_id_fkey" FOREIGN KEY ("type_plan_id") REFERENCES "TypePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
