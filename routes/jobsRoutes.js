import { Router } from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
  showStats,
} from "../controllers/jobsController.js";
import {
  validateJobInput,
  validateIdParam,
} from "../middlewares/validationMiddleware.js";
import { checkForDemoUser } from "../middlewares/authMiddleware.js";

const router = Router();

router
  .route("/")
  .get(getAllJobs)
  .post(checkForDemoUser, validateJobInput, createJob);

router.route("/stats").get(showStats);

router
  .route("/:id")
  .get(validateIdParam, getJob)
  .patch(checkForDemoUser, validateIdParam, validateJobInput, updateJob)
  .delete(checkForDemoUser, validateIdParam, deleteJob);

export default router;
