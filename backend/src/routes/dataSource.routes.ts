import { getNextFootballMatches } from "@controllers/dataSource.controller";
import express from "express";

const dataSourceRouter = express.Router();

dataSourceRouter.get("/get-football-matches", getNextFootballMatches);
export default dataSourceRouter;
