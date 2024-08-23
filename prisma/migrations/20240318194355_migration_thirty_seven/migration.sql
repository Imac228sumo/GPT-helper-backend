/*
  Warnings:

  - You are about to drop the column `plan_id` on the `Tool` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_plan_id_fkey";

-- AlterTable
ALTER TABLE "Tool" DROP COLUMN "plan_id";

-- CreateTable
CREATE TABLE "PlanTool" (
    "planId" INTEGER NOT NULL,
    "toolId" INTEGER NOT NULL,

    CONSTRAINT "PlanTool_pkey" PRIMARY KEY ("planId","toolId")
);

-- AddForeignKey
ALTER TABLE "PlanTool" ADD CONSTRAINT "PlanTool_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanTool" ADD CONSTRAINT "PlanTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
