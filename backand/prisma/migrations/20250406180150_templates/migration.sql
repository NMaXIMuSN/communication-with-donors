-- CreateEnum
CREATE TYPE "Language" AS ENUM ('RU', 'EN');

-- DropIndex
DROP INDEX "Template_name_key";

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "language" "Language";

-- CreateTable
CREATE TABLE "TemplateSettings" (
    "id" SERIAL NOT NULL,
    "lang" "Language" NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "templateId" INTEGER NOT NULL,

    CONSTRAINT "TemplateSettings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateSettings" ADD CONSTRAINT "TemplateSettings_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
