import express from "express";
import verifyToken from "../middleware/auth.js";
import { sequelize } from "../database.js";
import errorHandler from "../middleware/errorHandler.js";
import tryCatch from "../utils/tryCatch.js";
import verifyTeamMembership from "../middleware/verifyTeamMembership.js";

const router = express.Router();

router.get(
  "/:teamId/groups/:groupId/contests/problems",
  verifyToken,
  verifyTeamMembership,
  tryCatch(async (req, res) => {
    const { groupId } = req.params;
    const getContestsProblems = `
        SELECT
            C.id AS contestId
            ,C.url AS contestURL
            ,C.name AS contestName
            ,C.start_time AS contestStartTime
            ,C.division AS contestDivision
            ,C.number AS contestNumber
            ,P.id AS problemId
            ,P.url AS problemURL
            ,P.number AS problemNumber
            ,P.name AS problemName
            ,P.solved_count AS problemSolvedCount
        FROM
            contests AS C
            INNER JOIN problems AS P
                ON C.id = P.contestId
        WHERE
            C.groupId = ${groupId}
        ORDER BY
            C.division DESC
            ,P.solved_count DESC
            ,C.number ASC
            ,P.number ASC
            ,P.name ASC;`;
    const contestsProblems =
      (await sequelize.query(getContestsProblems, {
        type: sequelize.QueryTypes.SELECT,
      })) || [];
    res.status(200).json({ contestsProblems });
  })
);

router.use(errorHandler);

export default router;
