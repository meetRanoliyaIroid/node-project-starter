import User from "../../model/user";
import AuthHelper from "../helpers/authHelper";
import AccessToken from "../../model/accessToken";
import RefreshToken from "../../model/refreshToken";
import { OTP_EXPIRY_TIME } from "../config/constant";
import {
  BadRequestException,
  NotFoundException,
} from "../config/errorException";
import FcmToken from "../../model/fcmToken";
import CustomHelper from "../helpers/customHelper";
const expiresInSeconds = 300;

class AuthService {
  /**
   * Register data
   * @param {*} data
   * @returns
   */
  static async register(data) {
    // Check if user already exists
    const isUserExists = await User.findOne({
      where: {
        phone_number: data.phone_number,
      } 
    });

    if (isUserExists) {
      throw new BadRequestException("Phone number already in use.");
    }

    // Generate OTP
    const otp = await AuthHelper.generateOTP();
    data.otp = otp;
    data.otp_expiry = new Date(Date.now() + OTP_EXPIRY_TIME); // Set valid for OTP_EXPIRY_TIME

    // send SMS to the phone number
    try {
      CustomHelper.sendSMS(data.phone_number, `Your OTP is ${otp}`);
    } catch (error) {
      console.log(error);
    }

    // Hash password
    data.password = await AuthHelper.getHashPassword(data.password);

    const registerUser = await User.create(data);

    return registerUser;
  }

  /**
   * login user data
   * @param {*} data
   */
  static async login(data) {
    const user = await User.findOne({ where: { phone_number: data.phone_number } });

    if (!user) {
      throw new NotFoundException("User not exist with this phone number.");
    }

    // Check password
    const checkPassword = await AuthHelper.checkUserPassword(
      data.password,
      user.password
    );

    if (!checkPassword) {
      throw new BadRequestException("Password does not match!");
    }

    const randomString = await AuthHelper.generateRandomString();

    // Generate token
    const token = await AuthHelper.tokenGenerator({
      id: user.id,
      jti: randomString, // jti is the unique identifier for the token
    });

    // Store access token to user
    await AuthHelper.storeAccessToken(user, randomString); // store access token to user

    user.token = token;

    // Refresh token generate process
    const refreshToken = await AuthHelper.generateRandomString();

    await RefreshToken.create({
      token: refreshToken,
      accessToken: randomString,
    });

    const authenticate = {
      tokenType: "Bearer",
      accessToken: user.token,
      refreshToken: refreshToken,
      expiresIn: expiresInSeconds,
    };

    return { user, authenticate };
  }

  /**
   * Logout
   * @param {*} data
   * @returns
   */
  static async logout(data) {
    await AccessToken.update(
      { is_revoked: true },
      {
        where: {
          token: data.authUser.jti,
        },
      }
    );

    // Delete FCM token
    await FcmToken.destroy({
      where: {
        user_id: data.authUser.id,
        device_id: data.reqData.device_id,
      },
    });

    return;
  }

  /**
   * Send OTP
   * @param {*} data
   * @returns
   */
  static async sendOtp(data) {
    const user = await User.findOne({ where: { phone_number: data.phone_number } });

    if (!user) {
      throw new NotFoundException("User not exist with this phone number.");
    }

    // Generate OTP
    const otp = await AuthHelper.generateOTP();
    const otp_expiry = new Date(Date.now() + OTP_EXPIRY_TIME); // Set valid for OTP_EXPIRY_TIME

    // Update OTP and OTP expiry
    let updateData;
    if (data.is_forgot_password_flow) {
      updateData = { otp: otp, otp_expiry: otp_expiry };
    } else {
      updateData = { otp: otp, otp_expiry: otp_expiry, is_otp_verified: true };
    }
    await User.update(updateData, {
      where: {
        phone_number: data.phone_number,
      },
    });

    // send SMS to the phone number
    try {
      CustomHelper.sendSMS(data.phone_number, `Your OTP is ${otp}`);
    } catch (error) {
      console.log(error);
    }

    return true;
  }

  /**
   * Verify OTP
   * @param {*} data
   * @returns
   */
  static async verifyOtp(data) {
    let user = await User.findOne({ where: { phone_number: data.phone_number } });

    if (!user) {
      throw new NotFoundException("User not exist with this phone number.");
    }

    // Check if user has sent OTP or not
    if (user.otp == null) {
      throw new BadRequestException("Please send OTP first.");
    }

    // Check OTP
    if (user.otp !== data.otp) {
      throw new BadRequestException("Invalid OTP.");
    }

    // Check OTP expiry
    if (user.otp_expiry < new Date()) {
      throw new BadRequestException("OTP expired.");
    }

    // Update OTP and OTP expiry
    await User.update(
      { is_otp_verified: true, otp: null, otp_expiry: null },
      {
        where: {
          phone_number: data.phone_number,
        },
      }
    );

    // Get user after update
    user = await User.findOne({ where: { phone_number: data.phone_number } });

    // If forgot password flow, return true
    if (data.is_forgot_password_flow) {
      return true;
    }

    const randomString = await AuthHelper.generateRandomString();

    // Generate token
    const token = await AuthHelper.tokenGenerator({
      id: user.id,
      jti: randomString, // jti is the unique identifier for the token
    });

    // Store access token to user
    await AuthHelper.storeAccessToken(user, randomString); // store access token to user

    user.token = token;

    // Refresh token generate process
    const refreshToken = await AuthHelper.generateRandomString();

    await RefreshToken.create({
      token: refreshToken,
      accessToken: randomString,
    });

    const authenticate = {
      tokenType: "Bearer",
      accessToken: user.token,
      refreshToken: refreshToken,
      expiresIn: expiresInSeconds,
    };

    return { user, authenticate };
  }

  /**
   * Reset Password
   * @param {*} data
   * @returns
   */
  static async resetPassword(data) {
    const user = await User.findOne({ where: { phone_number: data.phone_number } });

    if (!user) {
      throw new NotFoundException("User not exist with this phone number.");
    }

    // Update password in database
    const hashedPassword = await AuthHelper.getHashPassword(data.password);
    await User.update(
      { password: hashedPassword },
      {
        where: {
          phone_number: data.phone_number,
        },
      }
    );

    const randomString = await AuthHelper.generateRandomString();

    // Generate token
    const token = await AuthHelper.tokenGenerator({
      id: user.id,
      jti: randomString, // jti is the unique identifier for the token
    });

    // Store access token to user
    await AuthHelper.storeAccessToken(user, randomString); // store access token to user

    user.token = token;

    // Refresh token generate process
    const refreshToken = await AuthHelper.generateRandomString();

    await RefreshToken.create({
      token: refreshToken,
      accessToken: randomString,
    });

    const authenticate = {
      tokenType: "Bearer",
      accessToken: user.token,
      refreshToken: refreshToken,
      expiresIn: expiresInSeconds,
    };

    return { user, authenticate };
  }
}

export default AuthService;
