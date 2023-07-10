import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const InvalidatedJWT = sequelize.define("invalidatedJWT", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING(1000),
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
