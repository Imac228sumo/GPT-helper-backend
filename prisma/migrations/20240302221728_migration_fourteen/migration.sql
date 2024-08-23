/*
  Warnings:

  - You are about to drop the column `subscription_id` on the `Order_item` table. All the data in the column will be lost.
  - Added the required column `subscription_name` to the `Order_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order_item" DROP CONSTRAINT "Order_item_subscription_id_fkey";

-- AlterTable
ALTER TABLE "Order_item" DROP COLUMN "subscription_id",
ADD COLUMN     "subscription_name" TEXT NOT NULL;
