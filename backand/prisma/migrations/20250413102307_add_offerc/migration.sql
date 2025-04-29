-- CreateTable
CREATE TABLE "Offers" (
    "id" SERIAL NOT NULL,
    "donorId" INTEGER NOT NULL,
    "channelType" "ChannelType" NOT NULL,
    "settingId" INTEGER NOT NULL,

    CONSTRAINT "Offers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES "TemplateSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
