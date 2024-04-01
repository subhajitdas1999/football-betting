-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NS', 'Complted');

-- AlterTable
ALTER TABLE "Predictions" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'NS';
