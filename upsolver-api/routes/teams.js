import express from "express";
import { Team, User, Invitation } from "../models/index.js";
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

router.get(
  "/:teamId/invitations",
  verifyToken,
  verifyTeamMembership,
  tryCatch(async (req, res) => {
    const { teamId } = req.params;
    const getTeamInvitations = `
        SELECT
            I.id AS id
            ,U1.name AS inviterName
            ,U1.username AS inviterUsername
            ,U1.rank AS inviterRank
            ,U1.avatar AS inviterAvatar
            ,U2.name AS inviteeName
            ,U2.username AS inviteeUsername
            ,U2.rank AS inviteeRank
            ,U2.avatar AS inviteeAvatar
            ,I.role AS role
            ,I.createdAt AS createdAt
        FROM
            
            invitations I
            INNER JOIN users U1
                ON I.inviterId = U1.id
            INNER JOIN users U2
                ON I.inviteeId = U2.id
        WHERE
            I.teamId = ${teamId}
        ORDER BY
            I.createdAt DESC;`;
    const invitations =
      (await sequelize.query(getTeamInvitations, {
        type: sequelize.QueryTypes.SELECT,
      })) || [];
    res.status(200).json({ invitations });
  })
);

router.post(
  "/:teamId/invitations",
  verifyToken,
  verifyTeamMembership,
  tryCatch(async (req, res) => {
    const { inviteeUsername, role } = req.body;

    if (!inviteeUsername || !role) {
      throw new AppError(400, "Please enter all the required fields");
    }

    const user = await User.findOne({ where: { username: inviteeUsername } });

    if (!user) {
      throw new AppError(404, "Invited user does not exist");
    }

    const inviteeId = user.id;

    const inviterId = req.user.user_id;
    const { teamId } = req.params;

    const invitation = await Invitation.create({
      inviterId: inviterId,
      teamId: teamId,
      inviteeId: inviteeId,
      role: role,
    });

    res.status(201).json({ invitation });
  })
);

router.use(errorHandler);

export default router;
