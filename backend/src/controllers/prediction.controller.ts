import { NextFunction, Request, Response } from "express";
import { BaseError, catchAsync, HttpStatusCode } from "./error.controller";
import {
  addPredictionInput,
  getAllPredictionInput,
  searchPrediction,
} from "validators/input.validator";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config({ path: "../.env" });

const prisma = new PrismaClient();

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
    const offChainHash = ethers.solidityPackedKeccak256(
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

export const addNewPrediction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = addPredictionInput.safeParse(req.body);
    if (!parsedBody.success) {
      throw new BaseError(
        HttpStatusCode.UNPROCESSABLE_ENTITY,
        "Invalid Input",
        "Not valid input"
      );
    }

    const prediction = await prisma.predictions.create({
      data: parsedBody.data,
    });

    res.status(HttpStatusCode.OK).json({
      status: "success",
      data: prediction,
    });
  }
);

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
    });

    let idsSet = new Set();
    predictions.forEach((prediction) => {
      idsSet.add(prediction.fixtureId);
    });

    let ids = [...idsSet].join("-");

    const matchData = await getPredictedMatchData(ids);
    const finishedMatchId: number[] = [];
    const modifyResult = matchData.map((md: any) => {
      const specificPredictions = predictions.filter(
        (p) => p.fixtureId === md.fixture.id
      );
      const status = md.fixture.status.short;
      // if (
      //   (status === "FT" || status === "AET" || status === "PEN") &&
      //   specificPredictions[0].status === "NS"
      // ) {
      //   finishedMatchId.push(md.fixture.id);
      // }
      finishedMatchId.push(md.fixture.id);

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
  return modifyResult;
};

const solveFinishedMatches = async (fixturesIds: number[]) => {
  console.log("starting in solveFinishedMatches", Date.now());

  // console.log(fixturesIds);
  for (let i in fixturesIds) {
    await handleFinishMatches(parseInt(i));
  }

  // return new Promise<string[]>((resolve) => {
  //   setTimeout(() => {
  //     resolve(["x", "y"]); // Example data
  //   }, 1000); // Simulated delay of 1 second
  // });

  console.log("finished in solveFinishedMatches", Date.now());
};

const handleFinishMatches = async (fixtureId: number) => {
  console.log("Inside handleFinishMatches", Date.now());

  return new Promise<number[]>((resolve) => {
    setTimeout(() => {
      resolve([fixtureId]); // Example data
    }, 2000); // Simulated delay of 1 second
  });
};
