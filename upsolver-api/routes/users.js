import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import dotenv from "dotenv";

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

    const encryptedPassword = await bcrypt.hash(password, 10);

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
        expiresIn: "2h",
      }
    );

    user.update({ token });

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
          expiresIn: "2h",
        }
      );

      user.update({ token });

      res.status(200).json(user);
    } else {
      res.status(400).json({ error: "[!] Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
