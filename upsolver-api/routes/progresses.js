import express from "express";
import verifyToken from "../middleware/auth.js";
import { sequelize } from "../database.js";
import errorHandler from "../middleware/errorHandler.js";
import tryCatch from "../utils/tryCatch.js";
import verifyTeamMembership from "../middleware/verifyTeamMembership.js";

const router = express.Router();

router.get(
  "/:teamId/groups/:groupId/progresses",
  verifyToken,
  verifyTeamMembership,
  tryCatch(async (req, res) => {
    const { groupId } = req.params;
    const { membership } = req.query;
    const problemsOfGroup = `
        SELECT
            P.id AS problemId
        FROM
            problems P
            INNER JOIN contests C
                ON P.contestId = C.id
            INNER JOIN groups G
                ON C.groupId = G.id
        WHERE
            G.id = ${groupId}
    `;
    const membersOfGroup = `
        SELECT
            U.id AS userId
        FROM
            users U
            INNER JOIN roles R
                ON R.userId = U.id
            INNER JOIN teams T
                ON T.id = R.teamId
            INNER JOIN groups G
                ON G.teamId = T.id
        WHERE
            G.id = ${groupId}
            AND (R.name = '${membership}' 
                OR '${membership}' = 'undefined')
    `;
    const getProgresses = `
        SELECT
            U.id AS userId
            ,count(P.id) AS numberOfProblemsOfGroup
            ,count(
                CASE
                    WHEN S.veredict = 'AC' THEN 1
                        ELSE NULL
                END) AS numberOfSolvedProblems
            ,100 * count(
                CASE
                    WHEN S.veredict = 'AC' THEN 1
                        ELSE NULL
                END) / count(P.id) AS progress
        FROM
            users U
            CROSS JOIN problems P
            LEFT JOIN submissions S
                ON S.userId = U.id
                AND S.problemId = P.id
        WHERE
            U.id IN (${membersOfGroup})
            AND P.id IN (${problemsOfGroup})
        GROUP BY
            U.id;
    `;

    const progresses = await sequelize.query(getProgresses, {
      type: sequelize.QueryTypes.SELECT,
    });
    res.status(200).json({ progresses });
  })
);

router.use(errorHandler);

export default router;
