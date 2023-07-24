import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Submission = sequelize.define("submission", {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  problemId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  veredict: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
});
