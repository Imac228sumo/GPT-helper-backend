/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_chatId_fkey";

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "message";

-- CreateTable
CREATE TABLE "YandexChat" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YandexChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yandexMessage" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "chatId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "yandexMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenAiChat" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenAiChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenAiMessage" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "chatId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenAiMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenAiAPI" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "httpProxyUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenAiAPI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletionOptionsOpenAi" (
    "id" SERIAL NOT NULL,
    "stream" BOOLEAN NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "maxTokens" INTEGER NOT NULL,
    "openAiApiId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompletionOptionsOpenAi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OpenAiAPI_name_key" ON "OpenAiAPI"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CompletionOptionsOpenAi_openAiApiId_key" ON "CompletionOptionsOpenAi"("openAiApiId");

-- AddForeignKey
ALTER TABLE "YandexChat" ADD CONSTRAINT "YandexChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yandexMessage" ADD CONSTRAINT "yandexMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "YandexChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenAiChat" ADD CONSTRAINT "OpenAiChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenAiMessage" ADD CONSTRAINT "OpenAiMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "OpenAiChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionOptionsOpenAi" ADD CONSTRAINT "CompletionOptionsOpenAi_openAiApiId_fkey" FOREIGN KEY ("openAiApiId") REFERENCES "OpenAiAPI"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
