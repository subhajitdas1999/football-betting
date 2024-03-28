import { checkPrediction } from "@controllers/prediction.controller";
import express from "express";
const predictionRouter = express.Router();

predictionRouter.get("/check", checkPrediction);

export default predictionRouter;
