-- CreateEnum
CREATE TYPE "GenderData" AS ENUM ('MANE', 'WOMEN');

-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('O', 'A', 'B', 'AB');

-- CreateEnum
CREATE TYPE "RHFactorType" AS ENUM ('plus', 'minus');

-- CreateEnum
CREATE TYPE "DonationType" AS ENUM ('WHOLE_BLOOD', 'RED_BLOOD_CELLS', 'PLASMA', 'PLATELETS', 'WHITE_BLOOD_CELLS');

-- CreateTable
CREATE TABLE "Donor" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "gender" "GenderData" NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "telegram" TEXT,
    "vk" TEXT,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalInfo" (
    "id" SERIAL NOT NULL,
    "bloodType" "BloodType" NOT NULL,
    "rhFactor" "RHFactorType" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "lastDonation" TIMESTAMP(3),
    "donorId" INTEGER NOT NULL,

    CONSTRAINT "MedicalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" SERIAL NOT NULL,
    "donorId" INTEGER NOT NULL,
    "donationDate" TIMESTAMP(3) NOT NULL,
    "donationType" "DonationType" NOT NULL,
    "bloodVolume" DOUBLE PRECISION NOT NULL,
    "donationLocation" TEXT NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MedicalInfo_donorId_key" ON "MedicalInfo"("donorId");

-- AddForeignKey
ALTER TABLE "MedicalInfo" ADD CONSTRAINT "MedicalInfo_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
