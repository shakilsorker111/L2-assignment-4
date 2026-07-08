import express from "express";
import cors from "cors";

import testRoute from "./routes/test.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", testRoute);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "GearUp Backend API Running",
  });
});

export default app;