/*
  Warnings:

  - You are about to drop the column `slug` on the `open_ai_chat` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "open_ai_chat_slug_key";

-- AlterTable
ALTER TABLE "open_ai_chat" DROP COLUMN "slug";
