/*
  Warnings:

  - Added the required column `name` to the `OpenAiChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OpenAiChat" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "timeLastRequest" TIMESTAMP(3);
