import express from "express";
import cors from "cors";

import router from "./app/routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "GearUp Backend API Running",
  });
});

export default app;