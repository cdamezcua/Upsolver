import { InvalidatedJWT } from "./invalidatedJWT.js";
import { User } from "./user.js";
import { Role } from "./role.js";
import { Team } from "./team.js";
import { Group } from "./group.js";
import { Invitation } from "./invitation.js";
import { Contest } from "./contest.js";
import { Problem } from "./problem.js";
import { Submission } from "./submission.js";
import { Message } from "./message.js";

User.hasMany(Role);
Role.belongsTo(User);

Team.hasMany(Role);
Role.belongsTo(Team);

Team.hasMany(Group);
Group.belongsTo(Team);

Group.hasMany(Contest);
Contest.belongsTo(Group);

Contest.hasMany(Problem);
Problem.belongsTo(Contest);

export {
  InvalidatedJWT,
  User,
  Role,
  Team,
  Group,
  Invitation,
  Contest,
  Problem,
  Submission,
  Message,
};
