import { sequelize } from "../database.js";
import { Role } from "../models/role.js";
import tryCatch from "../utils/tryCatch.js";
import AppError from "../utils/AppError.js";

const verifyTeamMembership = tryCatch(async (req, res, next) => {
  const { username } = req.user;
  const { teamId } = req.params;
  const getUserRoleToTeam = `
    SELECT 
        R.name 
    FROM
        teams T
        INNER JOIN roles R
            ON T.id = R.teamId
        INNER JOIN users U
            ON R.userId = U.id
    WHERE
        U.username = '${username}'
        AND T.id = ${teamId};`;
  const userRoleToTeam = await sequelize.query(getUserRoleToTeam, {
    type: sequelize.QueryTypes.SELECT,
    model: Role,
    mapToModel: true,
  });
  if (userRoleToTeam.length === 0) {
    throw new AppError(403, "You are not a member of this team");
  }
  return next();
});

export default verifyTeamMembership;
