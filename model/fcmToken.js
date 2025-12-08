/**
 * user.js
 * @description :: sequelize model of database table user
 */

import sequelizePaginate from "sequelize-paginate";
import sequelize from "../src/config/database";
import sequelizeTransforms from "sequelize-transforms";
import { DataTypes } from "sequelize";

let FcmToken = sequelize.define(
  "fcm_tokens",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    device_type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "1: ios, 2: android",
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at", // Customize createdAt column name
    updatedAt: "updated_at",
  }
);
sequelizeTransforms(FcmToken);
sequelizePaginate.paginate(FcmToken);
export default FcmToken;
