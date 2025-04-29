-- CreateEnum
CREATE TYPE "SegmentStatus" AS ENUM ('DRAFT', 'ERROR', 'CALCULATED', 'PROGRESS');

-- AlterTable
ALTER TABLE "Segment" ADD COLUMN     "status" "SegmentStatus" NOT NULL DEFAULT 'DRAFT';
