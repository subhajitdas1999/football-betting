import { addNewLeague } from "@controllers/admin.controller";
import { getNextFootballMatches } from "@controllers/dataSource.controller";
import express from "express";

const adminRouter = express.Router();

adminRouter.post("/addNewLeague", addNewLeague);
export default adminRouter;
