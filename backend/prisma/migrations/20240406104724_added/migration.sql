/*
  Warnings:

  - A unique constraint covering the columns `[team,fixtureId,amount,chain,walletAddress]` on the table `Predictions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Predictions_team_fixtureId_amount_chain_walletAddress_key" ON "Predictions"("team", "fixtureId", "amount", "chain", "walletAddress");
