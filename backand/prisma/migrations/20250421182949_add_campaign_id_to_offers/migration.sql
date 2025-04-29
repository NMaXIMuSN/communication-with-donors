/*
  Warnings:

  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RegisterUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "RegisterUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RegisterUserToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RegisterUserToRole_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RegisterUserToRole_B_index" ON "_RegisterUserToRole"("B");

-- AddForeignKey
ALTER TABLE "_RegisterUserToRole" ADD CONSTRAINT "_RegisterUserToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "RegisterUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RegisterUserToRole" ADD CONSTRAINT "_RegisterUserToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
