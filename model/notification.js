/**
 * accessToken.js
 * @description :: sequelize model of database table accessToken
 */

import sequelizePaginate from "sequelize-paginate";
import sequelize from "../src/config/database";
import sequelizeTransforms from "sequelize-transforms";
import { DataTypes } from "sequelize";

let Notification = sequelize.define(
  "notifications",
  {
    user_id: {
      type: DataTypes.INTEGER,
      ref: "users",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "1: Squad Invite",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seen_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    data_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    btn_type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "0: Pending, 1: Accepted, 2: Rejected",
    }
  },
  {
    timestamps: true,
    createdAt: "created_at", // Customize createdAt column name
    updatedAt: "updated_at",
  }
);

sequelizeTransforms(Notification);
sequelizePaginate.paginate(Notification);
export default Notification;
