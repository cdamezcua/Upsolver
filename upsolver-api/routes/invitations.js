import express from "express";
import verifyToken from "../middleware/auth.js";
import { sequelize } from "../database.js";
import tryCatch from "../utils/tryCatch.js";
import errorHandler from "../middleware/errorHandler.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  tryCatch(async (req, res) => {
    const getInvitations = `
        SELECT
            I.id AS id
            ,U.username AS inviter
            ,T.name AS team
            ,I.role AS role
            ,I.createdAt AS createdAt
        FROM
            invitations I
            INNER JOIN users U
                ON I.inviterId = U.id
            INNER JOIN teams T
                ON I.teamId = T.id
        WHERE
            I.inviteeId = ${req.user.user_id} 
        ORDER BY
            I.createdAt DESC;
    `;
    const invitations = await sequelize.query(getInvitations, {
      type: sequelize.QueryTypes.SELECT,
    });
    res.status(200).json({ invitations });
  })
);

router.use(errorHandler);

export default router;
