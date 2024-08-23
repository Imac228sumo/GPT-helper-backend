/*
  Warnings:

  - Added the required column `aiName` to the `OpenAiChat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelName` to the `OpenAiChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OpenAiChat" ADD COLUMN     "aiName" TEXT NOT NULL,
ADD COLUMN     "modelName" TEXT NOT NULL;
