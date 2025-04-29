/*
  Warnings:

  - Added the required column `lang` to the `Creative` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Creative" ADD COLUMN     "lang" "Language" NOT NULL;
