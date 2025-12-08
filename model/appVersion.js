/**
 * appVersion.js
 * @description :: sequelize model of database table app_versions
 */

import sequelizePaginate from "sequelize-paginate";
import sequelize from "../src/config/database";
import sequelizeTransforms from "sequelize-transforms";
import { DataTypes } from "sequelize";

let AppVersion = sequelize.define(
  "app_versions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    min_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    app_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    platform: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1: ios, 2: android",
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

sequelizeTransforms(AppVersion);
sequelizePaginate.paginate(AppVersion);
export default AppVersion; 