/*
  Warnings:

  - You are about to drop the column `tools` on the `Plan` table. All the data in the column will be lost.
  - Added the required column `plan_id` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "tools",
ADD COLUMN     "plan_id" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Tool" (
    "id" SERIAL NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "subTitleToolsItem" TEXT NOT NULL,
    "subTitleChatsItem" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "subAbout" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "iconSmall" TEXT NOT NULL,
    "iconMediumString" TEXT NOT NULL,
    "iconBigString" TEXT NOT NULL,
    "iconSquare" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypePlan" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "isSelect" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TypePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionTypePlan" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "type_plan_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptionTypePlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "TypePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionTypePlan" ADD CONSTRAINT "OptionTypePlan_type_plan_id_fkey" FOREIGN KEY ("type_plan_id") REFERENCES "TypePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
