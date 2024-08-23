-- AlterTable
ALTER TABLE "FreeSubscription" ADD COLUMN     "total" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "StandardSubscription" ADD COLUMN     "total" INTEGER NOT NULL DEFAULT 25;

-- CreateTable
CREATE TABLE "UnlimitedSubscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "tools" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnlimitedSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnlimitedSubscription_userId_key" ON "UnlimitedSubscription"("userId");

-- AddForeignKey
ALTER TABLE "UnlimitedSubscription" ADD CONSTRAINT "UnlimitedSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
