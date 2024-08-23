/*
  Warnings:

  - You are about to drop the `Tool` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_plan_id_fkey";

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "tools" TEXT[];

-- DropTable
DROP TABLE "Tool";
