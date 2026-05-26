import webhookRoute from "./routes/webhook.routes.js";
import express from "express";

const app = express();

app.use("/webhook", webhookRoute);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

export default app;