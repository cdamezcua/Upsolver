import express from "express";
import { Group } from "../models/index.js";
import verifyToken from "../middleware/auth.js";
import { sequelize } from "../database.js";
import tryCatch from "../utils/tryCatch.js";
import verifyTeamMembership from "../middleware/verifyTeamMembership.js";
import errorHandler from "../middleware/errorHandler.js";

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
            INNER JOIN teams T
                ON G.teamId = T.id
        WHERE
            T.id = ${teamId};`;
    const groups = await sequelize.query(getGroups, {
      type: sequelize.QueryTypes.SELECT,
      model: Group,
      mapToModel: true,
    }) || [];
    res.status(200).json({ groups });
  })
);

router.use(errorHandler);

export default router;
