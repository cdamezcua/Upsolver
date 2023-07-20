import express from "express";
import { Group } from "../models/index.js";
import verifyToken from "../middleware/auth.js";
import { sequelize } from "../database.js";
import tryCatch from "../utils/tryCatch.js";
import verifyTeamMembership from "../middleware/verifyTeamMembership.js";
import errorHandler from "../middleware/errorHandler.js";
import { FLASK_API_URL } from "../constants/urls.js";
import createContestAutomatically from "../services/CreateContestAutomatically.js";

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

    const createdContestsIds = await Promise.all(createContestPromises);

    res.status(201).json({ createdGroupId, createdContestsIds });
  })
);

router.use(errorHandler);

export default router;
