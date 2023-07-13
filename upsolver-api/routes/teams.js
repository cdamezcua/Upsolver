import express from "express";
import { Team } from "../models/index.js";
import verifyToken from "../middleware/auth.js";
import { sequelize } from "../database.js";
import errorHandler from "../middleware/errorHandler.js";
import tryCatch from "../utils/tryCatch.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  tryCatch(async (req, res) => {
    const { user } = req;
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
            U.username = '${user.username}'
        ORDER BY
            T.createdAt DESC;`;
    const teams = await sequelize.query(getTeams, {
      type: sequelize.QueryTypes.SELECT,
      model: Team,
      mapToModel: true,
    });
    res.status(200).json(teams);
  })
);

router.use(errorHandler);

export default router;
