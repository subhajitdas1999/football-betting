// import authRouter from "@routes/auth.routes";
// import notesRouter from "@routes/notes.routes";
// import { globalErrorHandler } from "@services/error.service";
import express from "express";
// import { rateLimit } from "express-rate-limit";

const app = express();
app.use(express.json());

//limit middleware to stop to many request from a certain IP to the server
// const limiter = rateLimit({
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   limit: 50, // Limit each IP to 50 requests per `window` (here, per 5 minutes).
//   message: "To many requests from this IP. Please try again after some time",
// });

//Apply the rate limiting middleware to API calls only
// app.use("/api", limiter);

// app.use("/api/auth", authRouter);
// app.use("/api/notes", notesRouter);

//if no route is hit till this point then
//all-> get,post,delete...
app.all("*", (req, res, next) => {
  res.status(300).json({
    status: "success",
    message: `server is running. ${req.originalUrl} is not valid path`,
  });
});

// app.use(globalErrorHandler);
export default app;
