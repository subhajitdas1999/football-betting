import { getNextFootballMatches } from "@controllers/dataSource.controller";
import { getAllLeagues } from "@controllers/league.controller";
import express from "express";

const dataRouter = express.Router();

dataRouter.get("/get-football-matches", getNextFootballMatches);
dataRouter.get("/getAllLeagues", getAllLeagues);

export default dataRouter;
