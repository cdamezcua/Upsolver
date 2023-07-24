import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Contest = sequelize.define("contest", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  groupId: {
    type: DataTypes.INTEGER,
    unique: false,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING(255),
    unique: false,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING(255),
    unique: false,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.STRING(255),
    unique: false,
    allowNull: true,
  },
  division: {
    type: DataTypes.STRING(255),
    unique: false,
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING(255),
    unique: false,
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
