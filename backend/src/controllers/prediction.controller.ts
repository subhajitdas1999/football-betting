import { NextFunction, Request, Response } from "express";
import { BaseError, catchAsync, HttpStatusCode } from "./error.controller";
import {
  addPredictionInput,
  getAllPredictionInput,
  searchPrediction,
} from "validators/input.validator";
import { PrismaClient, Result } from "@prisma/client";
import { ethers } from "ethers";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import path from "path";
import functionsConsumerAbi from "@contracts/BettingContract";
import { currentTime } from "utils/getCurrentTime";
dotenv.config({ path: "../.env" });

const prisma = new PrismaClient();
interface addPrediction {
  team: Result;
  amount: string;
  fixtureId: number;
  chain: string;
  walletAddress: string;
  txHash: string;
  leagueIdSeason: string;
}

export const checkPrediction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = searchPrediction.safeParse(req.query);
    if (!parsedBody.success) {
      throw new BaseError(
        HttpStatusCode.UNPROCESSABLE_ENTITY,
        "Invalid Input",
        "Not valid input"
      );
    }

    const prediction = await prisma.predictions.findFirst({
      where: {
        fixtureId: parsedBody.data.fixtureId,
      },
    });
    const offChainHash = ethers.utils.solidityKeccak256(
      ["bytes32", "uint256", "uint256"],
      [
        process.env.SECRETHASH,
        parsedBody.data.fixtureId,
        parsedBody.data.gameStartTimeStamp,
      ]
    );

    res.status(HttpStatusCode.OK).json({
      status: "success",
      data: prediction,
      offChainHash,
    });
  }
);

export const addNewPrediction = async (data: addPrediction) => {
  await prisma.predictions.create({
    data,
  });
};

export const getAllPredictions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = getAllPredictionInput.safeParse(req.query);
    if (!parsedBody.success) {
      throw new BaseError(
        HttpStatusCode.UNPROCESSABLE_ENTITY,
        "Invalid Input",
        "Not valid input"
      );
    }
    const query: any = { isActive: true };
    if (parsedBody.data.walletAddress) {
      query.walletAddress = parsedBody.data.walletAddress;
    }

    const predictions = await prisma.predictions.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
    });

    let idsSet = new Set();
    predictions.forEach((prediction) => {
      if (prediction.status == "NS") {
        idsSet.add(prediction.fixtureId);
      }
    });

    let ids = [...idsSet].join("-");

    const matchData = await getPredictedMatchData(ids);
    let finishedMatchId: number[] = [];
    const modifyResult = matchData.map((md: any) => {
      const specificPredictions = predictions.filter(
        (p) => p.fixtureId === md.fixture.id
      );
      const status = md.fixture.status.short;
      if (
        (status === "FT" || status === "AET" || status === "PEN") &&
        specificPredictions[0].status === "NS"
      ) {
        finishedMatchId.push(md.fixture.id);
      }

      return {
        ...md,
        predictions: specificPredictions,
      };
    });
    res.status(HttpStatusCode.OK).json({
      status: "success",
      dataLength: modifyResult.length,
      data: modifyResult,
    });

    if (finishedMatchId.length > 0) {
      solveFinishedMatches(finishedMatchId);
    }
  }
);

const getPredictedMatchData = async (ids: string) => {
  const params = {
    timezone: "Asia/Kolkata",
    ids,
  };
  const headers = {
    "Content-Type": "application/json",
    "x-rapidapi-key": process.env.APISPORTSKEY,
    "x-rapidapi-host": process.env.APISPORTSHOST,
  };

  const data = await axios.get(`${process.env.FOOTBALLDATASOURCURL}/fixtures`, {
    headers,
    params,
  });
  if (data.data.errors.length > 0) {
    throw new BaseError(
      HttpStatusCode.BAD_REQUEST,
      "Api call error",
      data.data.errors
    );
  }
  const modifyResult: any = [];
  data.data.response.map((matchData: any) => {
    delete matchData.league;
    delete matchData.score;
    delete matchData.events;
    delete matchData.lineups;
    delete matchData.players;
    modifyResult.push(matchData);
  });
  modifyResult.sort(
    (a: any, b: any) => a.fixture.timestamp - b.fixture.timestamp
  );
  return modifyResult;
};

const solveFinishedMatches = async (fixturesIds: number[]) => {
  console.log("starting in solveFinishedMatches", currentTime(), {
    fixturesIds,
  });

  // console.log(fixturesIds);
  for (let i = 0; i < fixturesIds.length; i++) {
    // console.log(fixturesIds[i], fixturesIds);

    await handleFinishMatches(fixturesIds[i]);
  }

  console.log("✅ finished in solveFinishedMatches", currentTime());
};

const handleFinishMatches = async (fixtureId: number) => {
  console.log(
    "Inside handleFinishMatches",
    currentTime(),
    "Fixture ID ",
    fixtureId
  );

  await makeRequestMumbai(fixtureId);

  console.log("Updating DB inside handleFinishMatches");

  // update the database
  await prisma.predictions.updateMany({
    where: { fixtureId },
    data: {
      status: "Competed",
    },
  });
};

const makeRequestMumbai = async (fixtureId: number) => {
  const consumerAddress = process.env.BETTINGCONTRACT as string; //In My case betting contract is the
  const subscriptionId = 1340; // chainlink function subscription id
  // hardcoded for Polygon Mumbai
  // const routerAddress = "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C";
  // const linkTokenAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
  const donId = "fun-polygon-mumbai-1";
  const explorerUrl = "https://mumbai.polygonscan.com";

  // Initialize functions settings
  const source = fs
    .readFileSync(path.resolve(__dirname, "../utils/source.js"))
    .toString();

  const args = [
    String(fixtureId),
    "FT-AET-PEN",
    process.env.APISPORTSKEY,
    process.env.APISPORTSHOST,
  ];
  const gasLimit = 300000;

  // Initialize ethers signer and provider to interact with the contracts onchain
  const privateKey = process.env.PRIVATE_KEY; // fetch PRIVATE_KEY
  if (!privateKey)
    throw new Error(
      "private key not provided - check your environment variables"
    );

  const rpcUrl = process.env.POLYGON_MUMBAI_RPC_URL; // fetch mumbai RPC URL

  if (!rpcUrl)
    throw new Error(`rpcUrl not provided  - check your environment variables`);

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider); // create ethers signer for signing transactions

  //////// MAKE REQUEST ////////

  console.log("\nMake request...");

  const functionsConsumer = new ethers.Contract(
    consumerAddress,
    functionsConsumerAbi,
    signer
  );

  // Actual transaction call
  const transaction = await functionsConsumer.sendRequest(
    source, // source
    "0x", // user hosted secrets - encryptedSecretsUrls - empty in this example
    0, // don hosted secrets - slot ID - empty in this example
    0, // don hosted secrets - version - empty in this example
    args,
    [], // bytesArgs - arguments can be encoded off-chain to bytes.
    subscriptionId,
    gasLimit,
    ethers.utils.formatBytes32String(donId) // jobId is bytes32 representation of donId
  );

  // Log transaction details
  console.log(
    `\n✅ Functions request sent! Transaction hash ${transaction.hash}. Waiting for a response...`
  );

  console.log(
    `See your request in the explorer ${explorerUrl}/tx/${transaction.hash}`
  );
};
