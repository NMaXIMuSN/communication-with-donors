/*
  Warnings:

  - You are about to drop the column `sqlQuery` on the `Segment` table. All the data in the column will be lost.
  - The `sourceId` column on the `Segment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Segment" DROP CONSTRAINT "Segment_sourceId_fkey";

-- AlterTable
ALTER TABLE "Segment" DROP COLUMN "sqlQuery",
ADD COLUMN     "filter" JSONB,
DROP COLUMN "sourceId",
ADD COLUMN     "sourceId" INTEGER[];

-- CreateTable
CREATE TABLE "_SegmentToSource" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SegmentToSource_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SegmentToSource_B_index" ON "_SegmentToSource"("B");

-- AddForeignKey
ALTER TABLE "_SegmentToSource" ADD CONSTRAINT "_SegmentToSource_A_fkey" FOREIGN KEY ("A") REFERENCES "Segment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SegmentToSource" ADD CONSTRAINT "_SegmentToSource_B_fkey" FOREIGN KEY ("B") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
