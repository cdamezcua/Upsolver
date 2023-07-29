import express from "express";
import usersRoutes from "./users.js";
import teamsRoutes from "./teams.js";
import groupsRoutes from "./groups.js";
import invitationsRoutes from "./invitations.js";
import contestsRoutes from "./contests.js";
import problemsRoutes from "./problems.js";
import submissionssRoutes from "./submissions.js";
import messagesRoutes from "./messages.js";

const router = express.Router();

router.use("/teams", messagesRoutes);
router.use("/teams", submissionssRoutes);
router.use("/teams", problemsRoutes);
router.use("/teams", contestsRoutes);
router.use("/teams", groupsRoutes);
router.use("/teams", teamsRoutes);
router.use("/users", usersRoutes);
router.use("/invitations", invitationsRoutes);

export default router;
