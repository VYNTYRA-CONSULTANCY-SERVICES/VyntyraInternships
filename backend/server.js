import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";
import applicationsRouter from "./src/routes/applications.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = process.env.UPLOAD_DIR ?? "uploads";
app.use("/uploads", express.static(path.resolve(process.cwd(), uploadsDir)));

app.use("/api/applications", applicationsRouter);

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  const status = err.statusCode ?? 500;
  res.status(status).json({ message: err.message ?? "Server error" });
});

const PORT = Number(process.env.PORT ?? 4000);

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
