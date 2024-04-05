import { ethers } from "ethers";

// Assuming you export your contract's ABI and address from another module:
import functionsConsumerAbi from "@contracts/BettingContract";
import dotenv from "dotenv";
import { addNewPrediction } from "./prediction.controller";
import { Result } from "@prisma/client";
dotenv.config({ path: "../.env" });

const provider = new ethers.providers.JsonRpcProvider(
  process.env.POLYGON_MUMBAI_RPC_URL
);
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
        chain: "MATIC",
        walletAddress: better,
        txHash: event.transactionHash,
        leagueIdSeason: leagueSeason,
      };
      await addNewPrediction(data);

      console.log("✅ prediction added in db");
    }
  );
};
