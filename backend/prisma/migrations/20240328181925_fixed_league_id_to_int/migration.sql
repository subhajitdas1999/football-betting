/*
  Warnings:

  - You are about to alter the column `leagueId` on the `Leagues` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Leagues" ALTER COLUMN "leagueId" SET DATA TYPE INTEGER,
ALTER COLUMN "end" SET DATA TYPE TEXT;
