import express from "express";
import cors from "cors";

import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

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



app.use(notFound);
app.use(globalErrorHandler);

export default app;