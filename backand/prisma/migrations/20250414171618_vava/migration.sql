/*
  Warnings:

  - Made the column `campaignId` on table `Offers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Offers" ALTER COLUMN "campaignId" SET NOT NULL,
ALTER COLUMN "campaignId" DROP DEFAULT;
