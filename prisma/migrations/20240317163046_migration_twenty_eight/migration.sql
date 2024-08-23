/*
  Warnings:

  - A unique constraint covering the columns `[plan_id,model]` on the table `Tool` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tool_model_key";

-- CreateIndex
CREATE UNIQUE INDEX "Tool_plan_id_model_key" ON "Tool"("plan_id", "model");
