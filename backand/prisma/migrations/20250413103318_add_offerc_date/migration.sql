/*
  Warnings:

  - Added the required column `finishAt` to the `Offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `Offers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offers" ADD COLUMN     "finishAt" "DataType" NOT NULL,
ADD COLUMN     "startAt" "DataType" NOT NULL;
