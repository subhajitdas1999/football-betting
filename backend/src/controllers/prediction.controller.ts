import { NextFunction, Request, Response } from "express";
import { BaseError, catchAsync, HttpStatusCode } from "./error.controller";
import {
  addPredictionInput,
  searchPrediction,
} from "validators/input.validator";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import dotenv from "dotenv";
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
