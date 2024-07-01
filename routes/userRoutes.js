import { Router } from "express";
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
} from "../controllers/userController.js";
import { validateUpdateUserInput } from "../middlewares/validationMiddleware.js";
import { authorizePermission, checkForDemoUser } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";

const router = Router();

router.get("/current-user", getCurrentUser);
router.get("/admin/app-stats", [
  authorizePermission("admin"),
  getApplicationStats,
]);
router.patch(
  "/update-user",
  checkForDemoUser,
  upload.single("avatar"),
  validateUpdateUserInput,
  updateUser
);

export default router;
