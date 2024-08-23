/*
  Warnings:

  - You are about to drop the `CompletionOptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `YandexAPI` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `YandexChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `yandexMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompletionOptions" DROP CONSTRAINT "CompletionOptions_yandexApiId_fkey";

-- DropForeignKey
ALTER TABLE "YandexChat" DROP CONSTRAINT "YandexChat_userId_fkey";

-- DropForeignKey
ALTER TABLE "yandexMessage" DROP CONSTRAINT "yandexMessage_chatId_fkey";

-- DropTable
DROP TABLE "CompletionOptions";

-- DropTable
DROP TABLE "YandexAPI";

-- DropTable
DROP TABLE "YandexChat";

-- DropTable
DROP TABLE "yandexMessage";

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_model_key" ON "Tool"("model");

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
