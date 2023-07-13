import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Group = sequelize.define("group", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    teamId: {
        type: DataTypes.INTEGER,
        unique: false,
        allowNull: false,
    },
    url : {
        type: DataTypes.STRING(255),
        unique: false,
        allowNull: true,
    },
    name: {
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
