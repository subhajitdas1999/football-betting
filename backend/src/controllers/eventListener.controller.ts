import { ethers } from "ethers";

// Assuming you export your contract's ABI and address from another module:
import functionsConsumerAbi from "@contracts/BettingContract";
import dotenv from "dotenv";
import { addNewPrediction, updatePrediction } from "./prediction.controller";
import { Result } from "@prisma/client";
dotenv.config({ path: "../.env" });

const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC);
const contract = new ethers.Contract(
  process.env.BETTINGCONTRACT as string,
  functionsConsumerAbi,
  provider
);

export const listenToContractEvents = () => {
  contract.on(
    "Predicted",
    async (fixtureId, amount, better, result, leagueSeason, event) => {
      // Further processing
      const data = {
        team: result == 0 ? Result.home : Result.away,
        amount: ethers.utils.formatEther(amount),
        fixtureId: parseInt(fixtureId.toString()),
        chain: "SEPOLIA",
        walletAddress: better,
        txHash: event.transactionHash,
        leagueIdSeason: leagueSeason,
      };
      await addNewPrediction(data);
    }
  );

  contract.on(
    "WinningAmountTransferred",
    async (
      fixtureId,
      predictionAmount,
      winningAmount,
      result,
      winnerAddress,
      event
    ) => {
      console.log("✅ WinningAmountTransferred Event Received");
      console.log({ fixtureId: fixtureId.toString() });
      console.log({ winningAmount: winningAmount.toString() });
      console.log({ result });
      console.log({ winnerAddress });
      console.log({ event });
      const query = {
        team: result == 0 ? Result.home : Result.away,
        fixtureId: parseInt(fixtureId.toString()),
        amount: ethers.utils.formatEther(predictionAmount),
        chain: "SEPOLIA",
        walletAddress: winnerAddress,
      };
      const data = {
        winingAmount: ethers.utils.formatEther(winningAmount),
      };
      updatePrediction(query, data);
    }
  );
};
