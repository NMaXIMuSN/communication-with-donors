/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `RegisterUser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hash]` on the table `RegisterUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StatusOffersLog" AS ENUM ('SUCCESS', 'ERROR');

-- CreateTable
CREATE TABLE "OffersLog" (
    "id" SERIAL NOT NULL,
    "donorId" INTEGER NOT NULL,
    "channelType" "ChannelType" NOT NULL,
    "settingId" INTEGER NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "status" "StatusOffersLog" NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OffersLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegisterUser_email_key" ON "RegisterUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RegisterUser_hash_key" ON "RegisterUser"("hash");

-- AddForeignKey
ALTER TABLE "OffersLog" ADD CONSTRAINT "OffersLog_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES "TemplateSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OffersLog" ADD CONSTRAINT "OffersLog_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
