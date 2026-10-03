import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import taskRoutes from "./routes/tasks";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/tasks", taskRoutes);
app.use((_req, res) => res.status(404).json({ message: "Route not found." }));

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

async function start(): Promise<void> {
  let uri = process.env.MONGO_URI;

  if (!uri) {
    const memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    console.log(`Using in-memory MongoDB at ${uri}`);
  }

  await mongoose.connect(uri);
  const port = Number(process.env.PORT ?? 5000);
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
