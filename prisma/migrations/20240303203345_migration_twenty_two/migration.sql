/*
  Warnings:

  - A unique constraint covering the columns `[user_id,name]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_user_id_name_key" ON "Subscription"("user_id", "name");
