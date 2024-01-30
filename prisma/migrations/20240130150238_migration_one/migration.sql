-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "countChats" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreeSubscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreeSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandardSubscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 25,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandardSubscription_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "YandexAPI" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "modelUri" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YandexAPI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompletionOptions" (
    "id" SERIAL NOT NULL,
    "stream" BOOLEAN NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "maxTokens" TEXT NOT NULL,
    "yandexApiId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompletionOptions_pkey" PRIMARY KEY ("id")
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
    "maxTokensInput" INTEGER NOT NULL DEFAULT 0,
    "maxTokensOutput" INTEGER NOT NULL DEFAULT 0,
    "openAiApiId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompletionOptionsOpenAi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FreeSubscription_userId_key" ON "FreeSubscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StandardSubscription_userId_key" ON "StandardSubscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "YandexAPI_name_key" ON "YandexAPI"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CompletionOptions_yandexApiId_key" ON "CompletionOptions"("yandexApiId");

-- CreateIndex
CREATE UNIQUE INDEX "OpenAiAPI_name_key" ON "OpenAiAPI"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CompletionOptionsOpenAi_openAiApiId_key" ON "CompletionOptionsOpenAi"("openAiApiId");

-- AddForeignKey
ALTER TABLE "FreeSubscription" ADD CONSTRAINT "FreeSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardSubscription" ADD CONSTRAINT "StandardSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YandexChat" ADD CONSTRAINT "YandexChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yandexMessage" ADD CONSTRAINT "yandexMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "YandexChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenAiChat" ADD CONSTRAINT "OpenAiChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenAiMessage" ADD CONSTRAINT "OpenAiMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "OpenAiChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionOptions" ADD CONSTRAINT "CompletionOptions_yandexApiId_fkey" FOREIGN KEY ("yandexApiId") REFERENCES "YandexAPI"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompletionOptionsOpenAi" ADD CONSTRAINT "CompletionOptionsOpenAi_openAiApiId_fkey" FOREIGN KEY ("openAiApiId") REFERENCES "OpenAiAPI"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
