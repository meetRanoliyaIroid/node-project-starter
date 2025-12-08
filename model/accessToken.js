/**
 * accessToken.js
 * @description :: sequelize model of database table accessToken
 */

import sequelizePaginate from "sequelize-paginate";
import sequelize from "../src/config/database";
import sequelizeTransforms from "sequelize-transforms";
import { DataTypes } from "sequelize";

let AccessToken = sequelize.define(
  "accessTokens",
  {
    user_id: {
      type: DataTypes.INTEGER,
      ref: "users",
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at", // Customize createdAt column name
    updatedAt: "updated_at",
  }
);

sequelizeTransforms(AccessToken);
sequelizePaginate.paginate(AccessToken);
export default AccessToken;
