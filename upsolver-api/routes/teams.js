import express from "express";
import { Team, User } from "../models/index.js";
import verifyToken from "../middleware/auth.js";
import { sequelize } from "../database.js";
import errorHandler from "../middleware/errorHandler.js";
import tryCatch from "../utils/tryCatch.js";
import verifyTeamMembership from "../middleware/verifyTeamMembership.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  tryCatch(async (req, res) => {
    const { username } = req.user;
    const getTeams = `
        SELECT 
            T.id
            ,T.name
            ,T.university
            ,T.createdAt
            ,T.updatedAt
        FROM
            teams T
            INNER JOIN roles R
                ON T.id = R.teamId
            INNER JOIN users U
                ON R.userId = U.id
        WHERE
            U.username = '${username}'
        ORDER BY
            T.createdAt DESC;`;
    const teams =
      (await sequelize.query(getTeams, {
        type: sequelize.QueryTypes.SELECT,
        model: Team,
        mapToModel: true,
      })) || [];
    res.status(200).json({ teams });
  })
);

router.get(
  "/:teamId",
  verifyToken,
  verifyTeamMembership,
  tryCatch(async (req, res) => {
    const { teamId } = req.params;
    const getTeams = `
        SELECT
            T.id
            ,T.name
            ,T.university
            ,T.createdAt
            ,T.updatedAt
        FROM
            teams T
        WHERE
            T.id = ${teamId};`;
    const teams = await sequelize.query(getTeams, {
      type: sequelize.QueryTypes.SELECT,
      model: Team,
      mapToModel: true,
    });
    res.status(200).json({ team: teams[0] });
  })
);

router.get(
  "/:teamId/users",
  verifyToken,
  verifyTeamMembership,
  tryCatch(async (req, res) => {
    const { teamId } = req.params;
    const getUsers = `
        SELECT
            U.id
            ,U.username
            ,U.email
            ,U.name
            ,U.cfHandle
            ,U.rank
            ,U.avatar
            ,U.titlePhoto
            ,U.createdAt
            ,U.updatedAt
            ,R.name AS role
        FROM
            users U
            INNER JOIN roles R
                ON U.id = R.userId
        WHERE
            R.teamId = ${teamId}
        ORDER BY
            U.createdAt DESC;`;
    const users = await sequelize.query(getUsers, {
      type: sequelize.QueryTypes.SELECT,
      model: User,
      mapToModel: true,
    });
    res.status(200).json(users);
  })
);

router.use(errorHandler);

export default router;
