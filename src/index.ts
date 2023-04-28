import dotenv from "dotenv";
dotenv.config();

import "./db/mongoose";
import express from "express";
import userRouter from "./routers/userRouter";
import partnerRouter from "./routers/partnerRouter";
import studyspotRouter from "./routers/studyspotRouter";
import reviewRouter from "./routers/reviewRouter";

const app = express();
app.use(express.json());
const port = 3000;

app.use(userRouter);
app.use(partnerRouter);
app.use(studyspotRouter);
app.use(reviewRouter);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
