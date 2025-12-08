/**
 * index.js
 * @description :: exports all the models and its relationships among other models
 */

import dbConnection from "../src/config/database";

//models
import User from "./user";
import AccessToken from "./accessToken";

const db = {};
db.sequelize = dbConnection;

User.hasMany(AccessToken, { foreignKey: "user_id", as: "accessTokens", sourceKey: "id", onDelete: "CASCADE" });
AccessToken.belongsTo(User, { foreignKey: "user_id", as: "user", targetKey: "id", onDelete: "CASCADE" });

export default db
