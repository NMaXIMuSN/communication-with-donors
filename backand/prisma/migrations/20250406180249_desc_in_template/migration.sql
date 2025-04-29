/*
  Warnings:

  - You are about to drop the column `content` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Template" DROP COLUMN "content",
DROP COLUMN "subject",
ADD COLUMN     "description" TEXT;
