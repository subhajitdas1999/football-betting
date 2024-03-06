import { NextFunction, Request, Response } from "express";
import { BaseError, HttpStatusCode, catchAsync } from "./error.controller";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const getNextFootballMatches = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { league, season } = req.query;
    const params = {
      league,
      season,
      timezone: "Asia/Kolkata",
      status: "NS",
    };
    const headers = {
      "Content-Type": "application/json",
      "x-rapidapi-key": process.env.APISPORTSKEY,
      "x-rapidapi-host": process.env.APISPORTSHOST,
    };

    const data = await axios.get(
      `${process.env.FOOTBALLDATASOURCURL}/fixtures`,
      { headers, params }
    );
    if (data.data.errors.length > 0) {
      throw new BaseError(
        HttpStatusCode.BAD_REQUEST,
        "Api call error",
        data.data.errors
      );
    }
    res.status(HttpStatusCode.OK).json({
      status: "success",
      data: data.data,
    });
  }
);
