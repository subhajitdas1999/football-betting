/*
  Warnings:

  - You are about to alter the column `season` on the `Leagues` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - Changed the type of `end` on the `Leagues` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Leagues" ALTER COLUMN "season" SET DATA TYPE INTEGER,
DROP COLUMN "end",
ADD COLUMN     "end" INTEGER NOT NULL;
