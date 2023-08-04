import express from "express";
import { Group } from "../models/index.js";
import verifyToken from "../middleware/auth.js";
import { sequelize } from "../database.js";
import tryCatch from "../utils/tryCatch.js";
import verifyTeamMembership from "../middleware/verifyTeamMembership.js";
import errorHandler from "../middleware/errorHandler.js";
import { FLASK_API_URL } from "../constants/urls.js";

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

router.get(
  "/:teamId/groups",
  verifyToken,
  verifyTeamMembership,
  tryCatch(async (req, res) => {
    const { teamId } = req.params;
    const getGroups = `
        SELECT
            G.id
            ,G.teamId
            ,G.url
            ,G.name
            ,G.createdAt
            ,G.updatedAt
        FROM
            groups G
        WHERE
            G.teamId = ${teamId};`;
    const groups =
      (await sequelize.query(getGroups, {
        type: sequelize.QueryTypes.SELECT,
        model: Group,
        mapToModel: true,
      })) || [];
    res.status(200).json({ groups });
  })
);

router.get(
  "/:teamId/groups/:groupId",
  verifyToken,
  verifyTeamMembership,
  tryCatch(async (req, res) => {
    const { teamId, groupId } = req.params;
    const getGroup = `
        SELECT
            G.id
            ,G.teamId
            ,G.url
            ,G.name
            ,G.createdAt
            ,G.updatedAt
        FROM
            groups G
        WHERE
            G.teamId = ${teamId}
            AND G.id = ${groupId};`;
    const group = await sequelize.query(getGroup, {
      type: sequelize.QueryTypes.SELECT,
      model: Group,
      mapToModel: true,
    });
    res.status(200).json({ group: group[0] ?? {} });
  })
);

router.post(
  "/:teamId/groups",
  verifyToken,
  verifyTeamMembership,
  tryCatch(async (req, res) => {
    const { teamId } = req.params;
    const { group_constructor } = req.body;

    const response = await fetch(FLASK_API_URL + "groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ group_constructor }),
    });
    const data = await response.json();

    const group = data.group;

    const createGroup = `
        INSERT INTO groups
            (teamId, url, name)
        VALUES
            (${teamId}, '${group.url}', '${group.name}');`;

    const [createdGroupId, created] = await sequelize.query(createGroup, {
      type: sequelize.QueryTypes.INSERT,
    });

    if (!created) {
      throw new AppError(500, "Failed to create group");
    }

    const contestConstructors = group.contest_constructors;

    const createContestPromises = await contestConstructors.map(
      async (contest_constructor) => {
        return await createContestAutomatically(
          createdGroupId,
          contest_constructor
        );
      }
    );

    const createdContests = await Promise.all(createContestPromises);

    res
      .status(201)
      .json({ group: { id: createdGroupId, contests: createdContests } });
  })
);

router.use(errorHandler);

export default router;
