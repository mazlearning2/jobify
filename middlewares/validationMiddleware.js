import mongoose from "mongoose";
import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customError.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import Job from "../models/jobModel.js";
import User from "../models/userModel.js";

const withValidationError = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("not authorized")) {
          throw new UnauthorizedError("مجاز به دسترسی به مسیر نیست");
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationError([
  body("company").notEmpty().withMessage("شرکت مورد نیاز است"),
  body("position").notEmpty().withMessage("موقعیت مورد نیاز است"),
  body("jobLocation").notEmpty().withMessage("محل کار مورد نیاز است"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("مقدار وضعیت نامعتبر"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("مقدار نوع نامعتبر"),
]);

export const validateIdParam = withValidationError([
  param("id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("شناسه نامعتبر است");
    const job = await Job.findById(value);
    if (!job) throw new NotFoundError(`id مورد نظر یافت نشد ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === job.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw new UnauthorizedError("مجوز دسترسی به این مسیر را ندارد");
  }),
]);

export const validateRegisterInput = withValidationError([
  body("name").notEmpty().withMessage("نام الزامی میباشد"),
  body("email")
    .notEmpty()
    .withMessage("آدرس ایمل الزامی میباشد")
    .isEmail()
    .withMessage("فرمت آدرس ایمل معتبر نمیباشد")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) throw new BadRequestError("آدرس ایمیل تکراری میباشد");
    }),
  body("password")
    .notEmpty()
    .withMessage("کلمه عبور الزامی میباشد")
    .isLength({ min: 8 })
    .withMessage("رمز عبور باید حداقل 8 کاراکتر باشد"),
  body("location").notEmpty().withMessage("مکان الزامی میباشد"),
]);

export const validateLoginInput = withValidationError([
  body("email")
    .notEmpty()
    .withMessage("آدرس ایمل الزامی میباشد")
    .isEmail()
    .withMessage("آدرس ایمیل معتبر نیست"),
  body("password")
    .notEmpty()
    .withMessage("رمز عبور باید حداقل 8 کاراکتر باشد"),
]);

export const validateUpdateUserInput = withValidationError([
  body("name").notEmpty().withMessage("نام الزامی میباشد"),
  body("email")
    .notEmpty()
    .withMessage("آدرس ایمیل الزامی میباشد")
    .isEmail()
    .withMessage("فرمت آدرس ایمیل معتبر نمیباشد")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId)
        throw new BadRequestError("آدرس ایمیل تکراری میباشد");
    }),
  body("location").notEmpty().withMessage("مکان الزامی است"),
  body("lastName").notEmpty().withMessage("نام خانوادگی الزامی است"),
]);
