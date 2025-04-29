/*
  Warnings:

  - Added the required column `campaignId` to the `Offers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offers" ADD COLUMN     "campaignId" INTEGER DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

