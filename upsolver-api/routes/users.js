import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, InvalidatedJWT } from "../models/index.js";
import dotenv from "dotenv";
import verifyToken from "../middleware/auth.js";
import {
  ROUNDS_OF_HASHING,
  TOKEN_LIFETIME,
  HEADER_TOKEN_KEY,
} from "../constants/config.js";
import errorHandler from "../middleware/errorHandler.js";
import tryCatch from "../utils/tryCatch.js";
import AppError from "../utils/AppError.js";

dotenv.config();

const router = express.Router();

router.post(
  "/register",
  tryCatch(async (req, res) => {
    const { username, email, password, name, cfHandle } = req.body;
    if (!username || !email || !password || !cfHandle) {
      throw new AppError(400, "Please enter all the required fields");
    }

    const usernameExists = await User.findOne({
      where: { username: username.toLowerCase() },
    });
    if (usernameExists) {
      throw new AppError(409, "Username already taken");
    }

    const emailExists = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    if (emailExists) {
      throw new AppError(409, "Email already used with another account");
    }

    const encryptedPassword = await bcrypt.hash(password, ROUNDS_OF_HASHING);
    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: encryptedPassword,
      name,
      cfHandle: cfHandle.toLowerCase(),
    });

    const token = jwt.sign(
      { user_id: user.id, username: username.toLowerCase() },
      process.env.TOKEN_KEY,
      {
        expiresIn: TOKEN_LIFETIME,
      }
    );
    await user.update({ token });

    res.status(201).json({ user });
  })
);

router.post(
  "/login",
  tryCatch(async (req, res) => {
    const { username, password } = req.body;

    if (!(username && password)) {
      throw new AppError(400, "Please enter all required fields");
    }

    const user = await User.findOne({
      where: { username: username.toLowerCase() },
    });

    if (!(user && (await bcrypt.compare(password, user.password)))) {
      throw new AppError(400, "Invalid credentials");
    }

    const token = jwt.sign(
      { user_id: user.id, username: username.toLowerCase() },
      process.env.TOKEN_KEY,
      {
        expiresIn: TOKEN_LIFETIME,
      }
    );

    await user.update({ token });

    res.status(200).json({ user });
  })
);

router.get("/is-logged-in", async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers[HEADER_TOKEN_KEY];
    if (!token) {
      res.status(200).json({ isLoggedIn: false });
    }
    req.token = token;
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const denylisted = await InvalidatedJWT.findOne({ where: { token } });
    if (denylisted) {
      res.status(200).json({ isLoggedIn: false });
    }
    req.user = decoded;
    res.status(200).json({ isLoggedIn: true });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(200).json({ isLoggedIn: false });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(200).json({ isLoggedIn: false });
    } else {
      return res.status(500).json({ isLoggedIn: true });
    }
  }
});

router.post(
  "/logout",
  verifyToken,
  tryCatch(async (req, res) => {
    const token = req.token;
    await InvalidatedJWT.create({ token });
    res.status(200).json({ message: "Logged out successfully" });
  })
);

router.use(errorHandler);

export default router;
