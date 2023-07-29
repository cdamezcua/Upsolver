import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Message = sequelize.define("message", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  problemId: {
    type: DataTypes.INTEGER,
    unique: false,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.INTEGER,
    unique: false,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
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
