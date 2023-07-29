import express from "express";
import verifyToken from "../middleware/auth.js";
import { sequelize } from "../database.js";
import errorHandler from "../middleware/errorHandler.js";
import tryCatch from "../utils/tryCatch.js";
import verifyTeamMembership from "../middleware/verifyTeamMembership.js";

const router = express.Router();

router.get(
  "/:teamId/problems/:problemId/messages",
  verifyToken,
  verifyTeamMembership,
  tryCatch(async (req, res) => {
    const getMessages = `
        SELECT
            M.content AS content
            ,M.problemId AS roomId
            ,U.username AS sender
            ,U.rank AS senderRank
        FROM
            messages M
            INNER JOIN users U ON M.senderId = U.id
        WHERE
            M.problemId = ${req.params.problemId}
        ORDER BY
            M.createdAt ASC
        `;
    const messages =
      (await sequelize.query(getMessages, {
        type: sequelize.QueryTypes.SELECT,
      })) || [];
    return res.status(200).json({ messages });
  })
);

router.post(
  "/:teamId/problems/:problemId/messages",
  verifyToken,
  verifyTeamMembership,
  tryCatch(async (req, res) => {
    const { content } = req.body;
    const { user_id } = req.user;
    const { problemId } = req.params;
    const createMessage = `
        INSERT INTO messages (problemId, senderId, content)
        VALUES (${problemId}, ${user_id}, '${content}')
        `;
    await sequelize.query(createMessage, {
      type: sequelize.QueryTypes.INSERT,
    });
    return res.status(200).json({ message: "Message sent successfully" });
  })
);

router.use(errorHandler);

export default router;
