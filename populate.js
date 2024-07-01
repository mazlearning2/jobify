import { readFile } from "fs/promises";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import databaseConnection from './utils/databaseConnection.js'

import Job from "./models/jobModel.js";
import User from "./models/userModel.js";

try {
  await databaseConnection();
  const user = await User.findOne({ email: "demo@app.dev" });
  const jsonJobs = JSON.parse(
    await readFile(new URL("./utils/staticData.json", import.meta.url))
  );
  const jobs = jsonJobs.map((job) => {
    return { ...job, createdBy: user._id };
  });
  await Job.deleteMany({ createdBy: user._id });
  await Job.create(jobs);
  console.log("success!!");
  process.exit(0);
} catch (error) {
  console.log("error!!");
  process.exit(1);
}
