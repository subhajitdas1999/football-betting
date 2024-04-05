// import authRouter from "@routes/auth.routes";
// import notesRouter from "@routes/notes.routes";
// import { globalErrorHandler } from "@services/error.service";
import {
  BaseError,
  globalErrorHandler,
  HttpStatusCode,
} from "@controllers/error.controller";
import express from "express";
import adminRouter from "@routes/admin.routes";
import dataRouter from "@routes/data.routes";
import cors from "cors";
import predictionRouter from "@routes/prediction.routes";
import { listenToContractEvents } from "@controllers/eventListener";
// import { rateLimit } from "express-rate-limit";

const app = express();
app.use(express.json());

//limit middleware to stop to many request from a certain IP to the server
// const limiter = rateLimit({
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   limit: 50, // Limit each IP to 50 requests per `window` (here, per 5 minutes).
//   message: "To many requests from this IP. Please try again after some time",
// });

const allowedOrigins =
  process.env.ALLOWEDORIGINS?.split(",").map((url) => url.trim()) || [];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Request from disallowed origin: ${origin}`);
      callback(
        new BaseError(
          HttpStatusCode.FORBIDDEN,
          "Not Allowed",
          "Not allowed by CORS"
        )
      );
    }
  },
};
app.use(cors(corsOptions));
//Apply the rate limiting middleware to API calls only
// app.use("/api", limiter);

// Initialize event listeners
listenToContractEvents();

app.use("/api/data", dataRouter);
app.use("/api/admin", adminRouter);
app.use("/api/v1/prediction", predictionRouter);

// app.use("/api/notes", notesRouter);

//if no route is hit till this point then
//all-> get,post,delete...
app.all("*", (req, res, next) => {
  res.status(300).json({
    status: "success",
    message: `server is running. ${req.originalUrl} is not valid path`,
  });
});

app.use(globalErrorHandler);
export default app;
