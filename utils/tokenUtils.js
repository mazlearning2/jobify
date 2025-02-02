import jwt from "jsonwebtoken";

export const createToken = (payload) => {
  const token = jwt.sign(payload, process.env.JET_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JET_SECRET);
  return decoded;
};
