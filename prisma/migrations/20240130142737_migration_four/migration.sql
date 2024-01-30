/*
  Warnings:

  - You are about to drop the column `maxTokens` on the `CompletionOptionsOpenAi` table. All the data in the column will be lost.
  - Added the required column `maxTokensInput` to the `CompletionOptionsOpenAi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTokensOutput` to the `CompletionOptionsOpenAi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompletionOptionsOpenAi" DROP COLUMN "maxTokens",
ADD COLUMN     "maxTokensInput" INTEGER NOT NULL,
ADD COLUMN     "maxTokensOutput" INTEGER NOT NULL;

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

-- CreateIndex
CREATE UNIQUE INDEX "FreeSubscription_userId_key" ON "FreeSubscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StandardSubscription_userId_key" ON "StandardSubscription"("userId");

-- AddForeignKey
ALTER TABLE "FreeSubscription" ADD CONSTRAINT "FreeSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardSubscription" ADD CONSTRAINT "StandardSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
