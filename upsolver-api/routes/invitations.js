import express from "express";
import verifyToken from "../middleware/auth.js";
import { sequelize } from "../database.js";
import tryCatch from "../utils/tryCatch.js";
import errorHandler from "../middleware/errorHandler.js";
import AppError from "../utils/AppError.js";

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

router.post(
  "/:invitationId/accept",
  verifyToken,
  tryCatch(async (req, res) => {
    const getInvetee = `
        SELECT
            inviteeId 
        FROM
            invitations
        WHERE
            id = ${req.params.invitationId};
    `;
    const [invitee] = await sequelize.query(getInvetee, {
      type: sequelize.QueryTypes.SELECT,
    });
    const inviteeId = invitee.inviteeId;
    if (inviteeId !== req.user.user_id) {
      throw new AppError(
        403,
        "You are not allowed to accept other's invitations"
      );
    }
    const getInvitation = `
        SELECT
            id
            ,teamId
            ,role
        FROM
            invitations
        WHERE
            id = ${req.params.invitationId};
    `;
    const [invitation] = await sequelize.query(getInvitation, {
      type: sequelize.QueryTypes.SELECT,
    });
    const teamId = invitation.teamId;
    const role = invitation.role;
    const addMember = `
        INSERT INTO
            roles (userId, teamId, name)
        VALUES
            (${req.user.user_id}, ${teamId}, '${role}')
        ON DUPLICATE KEY UPDATE
            name = '${role}';      
    `;

    await sequelize.query(addMember, {
      type: sequelize.QueryTypes.INSERT,
    });

    const deleteInvitation = `
        DELETE FROM
            invitations
        WHERE
            id = ${req.params.invitationId};
    `;
    await sequelize.query(deleteInvitation, {
      type: sequelize.QueryTypes.DELETE,
    });
    res.status(200).json({ message: "Invitation accepted" });
  })
);

router.post(
  "/:invitationId/reject",
  verifyToken,
  tryCatch(async (req, res) => {
    const getInvetee = `
        SELECT
            inviteeId 
        FROM
            invitations
        WHERE
            id = ${req.params.invitationId};
    `;
    const [invitee] = await sequelize.query(getInvetee, {
      type: sequelize.QueryTypes.SELECT,
    });
    const inviteeId = invitee.inviteeId;
    if (inviteeId !== req.user.user_id) {
      throw new AppError(
        403,
        "You are not allowed to reject other's invitations"
      );
    }
    const deleteInvitation = `
        DELETE FROM
            invitations
        WHERE
            id = ${req.params.invitationId};
    `;
    await sequelize.query(deleteInvitation, {
      type: sequelize.QueryTypes.DELETE,
    });
    res.status(200).json({ message: "Invitation rejected" });
  })
);

router.use(errorHandler);

export default router;
