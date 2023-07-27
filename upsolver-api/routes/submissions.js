import express from "express";
import verifyToken from "../middleware/auth.js";
import { sequelize } from "../database.js";
import { Submission } from "../models/submission.js";
import errorHandler from "../middleware/errorHandler.js";
import tryCatch from "../utils/tryCatch.js";
import verifyTeamMembership from "../middleware/verifyTeamMembership.js";

const router = express.Router();

router.get(
  "/:teamId/groups/:groupId/submissions",
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
    const submissionsOfMembersOfGroupToProblemsOfGroup = `
        SELECT
            U.id AS userId
            ,P.id AS problemId
            ,S.veredict AS veredict
        FROM
            users U
            CROSS JOIN problems P
            LEFT JOIN submissions S
                ON S.userId = U.id
                AND S.problemId = P.id
        WHERE
            U.id IN (${membersOfGroup})
            AND P.id IN (${problemsOfGroup});
    `;
    const submissions = await sequelize.query(
      submissionsOfMembersOfGroupToProblemsOfGroup,
      {
        type: sequelize.QueryTypes.SELECT,
        model: Submission,
        mapToModel: true,
      }
    );
    res.status(200).json({ submissions });
  })
);

router.patch(
  "/:teamId/groups/:groupId/submissions",
  verifyToken,
  verifyTeamMembership,
  tryCatch(async (req, res) => {
    const { userId, problemId } = req.query;
    const { veredict } = req.body;
    const submission = await Submission.findOne({
      where: {
        userId,
        problemId,
      },
    });
    if (submission) {
      submission.veredict = veredict;
      await submission.save();
      res.status(200).json({ submission });
    } else {
      const newSubmission = await Submission.create({
        userId,
        problemId,
        veredict,
      });
      res.status(201).json({ submission: newSubmission });
    }
  })
);

router.use(errorHandler);

export default router;
