import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Invitation = sequelize.define("invitation", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    inviterId: {
        type: DataTypes.INTEGER,
        unique: false,
        allowNull: false,
    },
    teamId: {
        type: DataTypes.INTEGER,
        unique: false,
        allowNull: false,
    },
    inviteeId: {
        type: DataTypes.INTEGER,
        unique: false,
        allowNull: false,
    },
    role: {
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
