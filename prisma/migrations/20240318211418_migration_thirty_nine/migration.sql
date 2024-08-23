/*
  Warnings:

  - A unique constraint covering the columns `[user_id,plan_id]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Subscription_user_id_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_user_id_plan_id_key" ON "Subscription"("user_id", "plan_id");
