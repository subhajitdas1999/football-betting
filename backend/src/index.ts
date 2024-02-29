// import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const port = process.env.PORT || 3000;
// console.log();

// mongoose
//   .connect(process.env.DB_URL as string, {
//     dbName: "noteApp",
//   })
//   .then((res) => console.log("db connection successful"))
//   .catch((err) => console.log(err));

const server = app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
