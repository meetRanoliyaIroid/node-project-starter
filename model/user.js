/**
 * user.js
 * @description :: sequelize model of database table user
 */

import sequelizePaginate from "sequelize-paginate";
import sequelize from "../src/config/database";
import sequelizeTransforms from "sequelize-transforms";
import { DataTypes } from "sequelize";

let User = sequelize.define(
  "users",
  {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: "1: Male, 2: Female, 3: Non-Binary, 4: Prefer not to say",
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_otp_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'UTC',
    },
  },
  {
    timestamps: true,
    createdAt: "created_at", // Customize createdAt column name
    updatedAt: "updated_at",
  }
);

sequelizeTransforms(User);
sequelizePaginate.paginate(User);
export default User;
