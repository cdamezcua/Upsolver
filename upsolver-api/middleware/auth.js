import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { InvalidatedJWT } from "../models/index.js";
import { HEADER_TOKEN_KEY } from "../constants/config.js";
import tryCatch from "../utils/tryCatch.js";
import AppError from "../utils/AppError.js";

dotenv.config();

const verifyToken = tryCatch(async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers[HEADER_TOKEN_KEY];
  if (!token) {
    throw new AppError(401, "A token is required for authentication");
  }
  req.token = token;
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  const denylisted = await InvalidatedJWT.findOne({ where: { token } });
  if (denylisted) {
    throw new AppError(401, "Denylisted token");
  }
  req.user = decoded;
  return next();
});

export default verifyToken;
