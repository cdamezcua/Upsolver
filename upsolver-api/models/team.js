import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Team = sequelize.define("team", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        unique: false,
        allowNull: false,
    },
    university: {
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