import express from "express";
import verifyToken from "../middleware/auth.js";
import tryCatch from "../utils/tryCatch.js";
import errorHandler from "../middleware/errorHandler.js";
import verifyTeamMembership from "../middleware/verifyTeamMembership.js";

import AppError from "../utils/AppError.js";
import { Contest } from "../models/index.js";

const createContestAutomatically = async (groupId, contest_constructor) => {
  try {
    const response = await fetch(FLASK_API_URL + "contests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contest_constructor }),
    });
    const data = await response.json();

    const contest = data.contest;

    const createContest = `
            INSERT INTO contests
                (groupId, url, name, start_time, division, number)
            VALUES
                (${groupId}, '${contest.url}', '${contest.name}', '${contest.start_time}', '${contest.division}', '${contest.number}');`;
    const [[createdContest], created] = await sequelize.query(createContest, {
      type: sequelize.QueryTypes.INSERT,
      model: Contest,
      mapToModel: true,
    });

    const problems = contest.problems;

    const createProblemsPromises = await problems.map(async (problem) => {
      const createProblem = `
                INSERT INTO problems
                    (contestId, url, number, name, solved_count)
                VALUES
                    (${createdContest.id}, '${problem.url}', '${problem.number}', '${problem.name}', ${problem.solved_count});`;
      const [[createdProblem], created] = await sequelize.query(createProblem, {
        type: sequelize.QueryTypes.INSERT,
        model: Contest,
        mapToModel: true,
      });

      return createdProblem.id;
    });

    const createdProblemIds = await Promise.all(createProblemsPromises);

    if (!created) {
      throw new AppError(500, "Failed to create contest");
    }

    return { id: createdContest.id, problems: createdProblemIds };
  } catch (err) {
    return err;
  }
};

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
