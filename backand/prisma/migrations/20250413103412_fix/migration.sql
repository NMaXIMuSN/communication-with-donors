/*
  Warnings:

  - Changed the type of `finishAt` on the `Offers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startAt` on the `Offers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Offers" DROP COLUMN "finishAt",
ADD COLUMN     "finishAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "startAt",
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;
