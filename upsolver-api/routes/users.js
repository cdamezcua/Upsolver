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

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, name, cfHandle } = req.body;

    if (!username || !email || !password || !cfHandle) {
      res.status(400).json({ error: "[!] Please enter all required fields" });
    }

    const usernameExists = await User.findOne({
      where: { username: username.toLowerCase() },
    });
    if (usernameExists) {
      res.status(400).json({ error: "[!] Username already taken" });
    }

    const emailExists = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    if (emailExists) {
      res
        .status(400)
        .json({ error: "[!] Email already used with another account" });
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

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).json({ error: "[!] Please enter all required fields" });
    }

    const user = await User.findOne({
      where: { username: username.toLowerCase() },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user.id, username: username.toLowerCase() },
        process.env.TOKEN_KEY,
        {
          expiresIn: TOKEN_LIFETIME,
        }
      );

      await user.update({ token });

      res.status(200).json(user);
    } else {
      res.status(400).json({ error: "[!] Invalid token" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/is-logged-in", async (req, res) => {
  const token =
    req.body.token || req.query.token || req.headers[HEADER_TOKEN_KEY];
  if (!token) {
    res
      .status(200)
      .json({ isLoggedIn: false, reason: "[!] No token provided" });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      const invalidated = await InvalidatedJWT.findOne({ where: { token } });
      if (invalidated) {
        res
          .status(200)
          .json({ isLoggedIn: false, reason: "[!] Invalidated token" });
      } else {
        res.status(200).json({ isLoggedIn: true, reason: "Valid token" });
      }
    } catch (err) {
      console.log(err);
      res.status(200).json({ isLoggedIn: false, reason: "[!] Invalid token" });
    }
  }
});

router.post("/logout", verifyToken, async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers[HEADER_TOKEN_KEY];
    await InvalidatedJWT.create({ token });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "[!] Invalid token" });
  }
});

export default router;
