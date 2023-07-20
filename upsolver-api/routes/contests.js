import express from "express";
import verifyToken from "../middleware/auth.js";
import tryCatch from "../utils/tryCatch.js";
import errorHandler from "../middleware/errorHandler.js";
import createContestAutomatically from "../services/CreateContestAutomatically.js";
import verifyTeamMembership from "../middleware/verifyTeamMembership.js";

const router = express.Router();

router.post(
  "/:teamId/groups/:groupId/contests",
  verifyToken,
  verifyTeamMembership,
  tryCatch(async (req, res) => {
    const { groupId } = req.params;
    const { contest_constructor } = req.body;
    const createdContestsId = await createContestAutomatically(
      groupId,
      contest_constructor
    );
    res.status(201).json({ createdContestsId });
  })
);

router.use(errorHandler);

export default router;
