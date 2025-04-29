/*
  Warnings:

  - You are about to alter the column `limit` on the `Segment` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Segment" ALTER COLUMN "limit" SET DATA TYPE INTEGER;
