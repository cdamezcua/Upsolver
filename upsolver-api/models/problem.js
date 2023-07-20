import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Problem = sequelize.define("problem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  contestId: {
    type: DataTypes.INTEGER,
    unique: false,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING(255),
    unique: false,
    allowNull: true,
  },
  number: {
    type: DataTypes.STRING(255),
    unique: false,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    unique: false,
    allowNull: false,
  },
  solved_count: {
    type: DataTypes.INTEGER,
    unique: false,
    allowNull: false,
    defaultValue: 0,
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
