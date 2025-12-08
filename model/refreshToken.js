/**
 * refreshToken.js
 * @description :: sequelize model of database table refreshToken
 */

import sequelizePaginate from "sequelize-paginate";
import sequelize from "../src/config/database";
import sequelizeTransforms from "sequelize-transforms";
import { DataTypes } from "sequelize";

let RefreshToken = sequelize.define(
  "refreshTokens",
  {
    accessToken: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
  },
  {
    timestamps: true,
    createdAt: "created_at", // Customize createdAt column name
    updatedAt: "updated_at",
  }
);

sequelizeTransforms(RefreshToken);
sequelizePaginate.paginate(RefreshToken);
export default RefreshToken;
