import { NextFunction, Request, Response } from "express";
import { BaseError, HttpStatusCode, catchAsync } from "./error.controller";
import axios from "axios";
import dotenv from "dotenv";
import { addNewLeagueInput } from "validators/input.validator";

dotenv.config({ path: "../.env" });

export const addNewLeague = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = addNewLeagueInput.safeParse(req.body);
    if (!parsedBody.success) {
      throw new BaseError(
        HttpStatusCode.UNPROCESSABLE_ENTITY,
        "Invalid Input",
        "Not valid input"
      );
    }

    res.status(HttpStatusCode.OK).json({
      status: "success",
      //   data: data.data,
    });
  }
);
