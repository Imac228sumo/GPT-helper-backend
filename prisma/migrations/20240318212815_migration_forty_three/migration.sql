/*
  Warnings:

  - You are about to drop the column `plan_name` on the `Order_item` table. All the data in the column will be lost.
  - Added the required column `plan_id` to the `Order_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order_item" DROP COLUMN "plan_name",
ADD COLUMN     "plan_id" INTEGER NOT NULL;
