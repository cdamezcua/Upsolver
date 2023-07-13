import express from "express";
import usersRoutes from "./users.js";
import teamsRoutes from "./teams.js";
import groupsRoutes from "./groups.js";

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/teams", teamsRoutes);
router.use("/teams", groupsRoutes);

export default router;
