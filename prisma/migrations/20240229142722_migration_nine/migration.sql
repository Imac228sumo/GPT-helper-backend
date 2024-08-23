/*
  Warnings:

  - You are about to drop the `StandardSubscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnlimitedSubscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StandardSubscription" DROP CONSTRAINT "StandardSubscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "UnlimitedSubscription" DROP CONSTRAINT "UnlimitedSubscription_userId_fkey";

-- DropTable
DROP TABLE "StandardSubscription";

-- DropTable
DROP TABLE "UnlimitedSubscription";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 25,
    "total" INTEGER NOT NULL DEFAULT 25,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
