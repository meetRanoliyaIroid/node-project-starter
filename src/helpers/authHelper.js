import { ENV, STATIC_OTP_ENV } from "../config/constant";
import jwt from "jsonwebtoken";
import { JWT } from "../config/constant";
import moment from "moment";
import AccessToken from "../../model/accessToken";
import bcrypt from "bcrypt";
const Hours = 8760;

class AuthHelper {
  /**
   * JWT token generator
   * @param {*} data
   * @returns
   */
  static async tokenGenerator(data) {
    return await jwt.sign(data, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN });
  }

  /**
   * Get data from jwt token
   * @param {*} token
   * @returns
   */
  static async getDataFromToken(token) {
    return jwt.verify(token, JWT.SECRET);
  }

  /**
   * Store access token to database
   *
   * @param Object user
   * @param String cryptoString
   * @return Response
   */
  static async storeAccessToken(user, cryptoString) {
    const expiredAt = moment(new Date())
      .utc()
      .add(Hours, "hours")
      .format("YYYY-MM-DD hh:mm:ss");

    const insertData = {
      token: cryptoString,
      user_id: user.id,
      expires_at: expiredAt,
    };

    return await AccessToken.create(insertData);
  }

  /**
   * Get Hash Password
   * @param {*} password
   * @returns
   */
  static async getHashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Check user password
   * @param {*} plainPassword
   * @param {*} hashedPassword
   * @returns
   */
  static async checkUserPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Generate a 4 digit OTP
   * @returns {number}
   */
  static async generateOTP() {
    // Generate a 4 digit OTP
    const otp = STATIC_OTP_ENV.includes(ENV)
      ? "1111"
      : Math.floor(1000 + Math.random() * 9000);
    return otp;
  }

  /**
   * Generate a random string
   * @returns {string}
   */
  static async generateRandomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export default AuthHelper;
