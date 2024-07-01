import { StatusCodes } from "http-status-codes";
const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "مشکلی پیش آمد، بعداً دوباره امتحان کنید";
  res.status(statusCode).json({ message });
};

export default errorHandlerMiddleware;
