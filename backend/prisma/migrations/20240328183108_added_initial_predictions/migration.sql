-- CreateEnum
CREATE TYPE "Result" AS ENUM ('home', 'away');

-- CreateTable
CREATE TABLE "Predictions" (
    "id" TEXT NOT NULL,
    "team" "Result" NOT NULL,
    "fixtureId" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "chain" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "leagueId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Predictions_pkey" PRIMARY KEY ("id")
);
