-- CreateTable
CREATE TABLE "SegmentUser" (
    "id" SERIAL NOT NULL,
    "segmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SegmentUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SegmentUser" ADD CONSTRAINT "SegmentUser_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "Segment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
