import express from "express";
import usersRoutes from "./users.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  res.send(`Welcome to Upsolver API @${req.user.username}!`);
});

router.use("/users", usersRoutes);

export default router;
