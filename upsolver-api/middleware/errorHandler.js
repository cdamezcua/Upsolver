import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";

export default function errorHandler(error, req, res, next) {
  if (error instanceof AppError) {
    return res.status(error.status).json({ error: "[!] " + error.message });
  } else if (error instanceof jwt.TokenExpiredError) {
    return res.status(401).json({ error: "[!] Expired token" });
  } else if (error instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({ error: "[!] Invalid token" });
  } else if (error instanceof Error) {
    return res.status(500).json({ error: "[!] " + error.message });
  } else {
    return res.status(500).json({ error: "[!] Internal server error" });
  }
}
