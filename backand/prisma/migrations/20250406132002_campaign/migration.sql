/*
  Warnings:

  - The values [DRAFT,SCHEDULED,CANCELLED] on the enum `CampaignStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `scheduledAt` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `channelId` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the `CampaignChannel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CampaignTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Communication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommunicationChannel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endAt` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('EMAIL', 'TELEGRAM');

-- CreateEnum
CREATE TYPE "CreativeStatus" AS ENUM ('ACTIVE', 'DEACTIVATED');

-- AlterEnum
BEGIN;
CREATE TYPE "CampaignStatus_new" AS ENUM ('DEACTIVATED', 'ACTIVE', 'COMPLETED');
ALTER TABLE "Campaign" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Campaign" ALTER COLUMN "status" TYPE "CampaignStatus_new" USING ("status"::text::"CampaignStatus_new");
ALTER TYPE "CampaignStatus" RENAME TO "CampaignStatus_old";
ALTER TYPE "CampaignStatus_new" RENAME TO "CampaignStatus";
DROP TYPE "CampaignStatus_old";
ALTER TABLE "Campaign" ALTER COLUMN "status" SET DEFAULT 'DEACTIVATED';
COMMIT;

-- DropForeignKey
ALTER TABLE "CampaignChannel" DROP CONSTRAINT "CampaignChannel_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignChannel" DROP CONSTRAINT "CampaignChannel_channelId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignTemplate" DROP CONSTRAINT "CampaignTemplate_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignTemplate" DROP CONSTRAINT "CampaignTemplate_templateId_fkey";

-- DropForeignKey
ALTER TABLE "Communication" DROP CONSTRAINT "Communication_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "Communication" DROP CONSTRAINT "Communication_channelId_fkey";

-- DropForeignKey
ALTER TABLE "Communication" DROP CONSTRAINT "Communication_templateId_fkey";

-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_channelId_fkey";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "scheduledAt",
ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'DEACTIVATED';

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "channelId";

-- DropTable
DROP TABLE "CampaignChannel";

-- DropTable
DROP TABLE "CampaignTemplate";

-- DropTable
DROP TABLE "Communication";

-- DropTable
DROP TABLE "CommunicationChannel";

-- CreateTable
CREATE TABLE "Channels" (
    "id" SERIAL NOT NULL,
    "type" "ChannelType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "campaignId" INTEGER NOT NULL,

    CONSTRAINT "Channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creative" (
    "id" SERIAL NOT NULL,
    "type" "ChannelType" NOT NULL,
    "channelId" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,
    "status" "CreativeStatus" NOT NULL DEFAULT 'DEACTIVATED',

    CONSTRAINT "Creative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CampaignToTemplate" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CampaignToTemplate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CampaignToTemplate_B_index" ON "_CampaignToTemplate"("B");

-- AddForeignKey
ALTER TABLE "Channels" ADD CONSTRAINT "Channels_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creative" ADD CONSTRAINT "Creative_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creative" ADD CONSTRAINT "Creative_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToTemplate" ADD CONSTRAINT "_CampaignToTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignToTemplate" ADD CONSTRAINT "_CampaignToTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
