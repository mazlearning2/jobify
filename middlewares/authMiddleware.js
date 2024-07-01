import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customError.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError("احراز هویت نامعتبر است");
  try {
    const { userId, role } = verifyJWT(token);
    const demoUser = userId === "6677ce6c6a430f7fa6b408b0";
    req.user = { userId, role, demoUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError("احراز هویت نامعتبر است");
  }
};

export const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("خطای غیرمجاز برای دسترسی به این مسیر");
    }
    next();
  };
};

export const checkForDemoUser = (req, res, next) => {
  if (req.user.demoUser) throw new BadRequestError("کاربر دمو نمیتواند تغییراتی ایجاد کند");
  next();
};
