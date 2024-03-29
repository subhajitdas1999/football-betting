import {
  addNewPrediction,
  checkPrediction,
} from "@controllers/prediction.controller";
import express from "express";
const predictionRouter = express.Router();

predictionRouter.get("/check", checkPrediction);
predictionRouter.post("/add", addNewPrediction);

export default predictionRouter;
