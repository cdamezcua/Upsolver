import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User, Team, Role } from "./models/index.js";
import { sequelize } from "./database.js";
import bcrypt from "bcrypt";
import { ROUNDS_OF_HASHING } from "./constants/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./seeders/users.json"), "utf8")
);
const teamData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./seeders/teams.json"), "utf8")
);
const roleData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./seeders/roles.json"), "utf8")
);

userData.forEach(async (user) => {
  user.password = await bcrypt.hash(user.password, ROUNDS_OF_HASHING);
});

const seedDatabase = async () => {
  try {
    await Promise.all([
      sequelize.query("DROP TABLE IF EXISTS users"),
      sequelize.query("DROP TABLE IF EXISTS roles"),
      sequelize.query("DROP TABLE IF EXISTS teams"),
      sequelize.query("DROP TABLE IF EXISTS invalidatedJWTs"),
    ]);

    await sequelize.sync({ alter: true });

    await Promise.all([
      User.bulkCreate(userData),
      Team.bulkCreate(teamData),
      Role.bulkCreate(roleData),
    ]);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
