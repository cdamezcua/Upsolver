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
    await sequelize.query("DROP TABLE IF EXISTS users");
    await sequelize.query("DROP TABLE IF EXISTS roles");
    await sequelize.query("DROP TABLE IF EXISTS teams");

    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");

    await User.bulkCreate(userData);
    console.log("Users were synchronized successfully.");
    await Team.bulkCreate(teamData);
    console.log("Teams were synchronized successfully.");
    await Role.bulkCreate(roleData);
    console.log("Roles were synchronized successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
