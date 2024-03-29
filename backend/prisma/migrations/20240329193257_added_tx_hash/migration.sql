/*
  Warnings:

  - Added the required column `txHash` to the `Predictions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Predictions" ADD COLUMN     "txHash" TEXT NOT NULL;
