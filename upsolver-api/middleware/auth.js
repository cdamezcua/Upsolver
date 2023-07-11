import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { InvalidatedJWT } from "../models/index.js";

dotenv.config();

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send("[!] A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const invalidated = await InvalidatedJWT.findOne({ where: { token } });
    if (invalidated) {
      return res.status(401).send("[!] Invalidated token");
    }
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("[!] Invalid Token");
  }
  return next();
};

export default verifyToken;
