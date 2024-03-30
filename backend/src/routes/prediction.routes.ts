import {
  addNewPrediction,
  checkPrediction,
  getAllPredictions,
} from "@controllers/prediction.controller";
import express from "express";
const predictionRouter = express.Router();

predictionRouter.get("/check", checkPrediction);
predictionRouter.get("/", getAllPredictions);
predictionRouter.post("/add", addNewPrediction);

export default predictionRouter;
