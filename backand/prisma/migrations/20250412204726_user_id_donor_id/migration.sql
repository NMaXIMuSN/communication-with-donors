/*
  Warnings:

  - You are about to drop the column `userId` on the `SegmentUser` table. All the data in the column will be lost.
  - Added the required column `donorId` to the `SegmentUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SegmentUser" DROP CONSTRAINT "SegmentUser_segmentId_fkey";

-- AlterTable
ALTER TABLE "SegmentUser" DROP COLUMN "userId",
ADD COLUMN     "donorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SegmentUser" ADD CONSTRAINT "SegmentUser_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "Segment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
