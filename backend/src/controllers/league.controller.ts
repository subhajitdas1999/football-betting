import { NextFunction, Request, Response } from "express";
import { BaseError, HttpStatusCode, catchAsync } from "./error.controller";
import axios from "axios";
import dotenv from "dotenv";
import { addNewLeagueInput } from "validators/input.validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

dotenv.config({ path: "../.env" });

export const getAllLeagues = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const league = await prisma.leagues.findMany();

    res.status(HttpStatusCode.OK).json({
      status: "success",
      data: league,
    });
  }
);
