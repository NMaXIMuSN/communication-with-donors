/*
  Warnings:

  - You are about to drop the column `donorId` on the `Communication` table. All the data in the column will be lost.
  - You are about to drop the `Donor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Communication" DROP CONSTRAINT "Communication_donorId_fkey";

-- AlterTable
ALTER TABLE "Communication" DROP COLUMN "donorId";

-- DropTable
DROP TABLE "Donor";
