/*
  Warnings:

  - You are about to drop the column `leagueId` on the `Predictions` table. All the data in the column will be lost.
  - Added the required column `leagueIdSeason` to the `Predictions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Predictions" DROP COLUMN "leagueId",
ADD COLUMN     "leagueIdSeason" TEXT NOT NULL;
