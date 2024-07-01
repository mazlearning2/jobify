import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
// external imports
import * as dotenv from "dotenv";
dotenv.config();
// utils imports
import databaseConnection from "./utils/databaseConnection.js";
// routes imports
import jobsRoutes from "./routes/jobsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// public
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";

// middlewares imports
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
import { authenticatedUser } from "./middlewares/authMiddleware.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.static(path.resolve(__dirname, "./public")));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/jobs", authenticatedUser, jobsRoutes);
app.use("/api/v1/users", authenticatedUser, userRoutes);
app.use("/api/v1/auth", authRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "مسیر یافت نشد" });
});
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await databaseConnection();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
