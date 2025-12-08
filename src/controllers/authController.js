import AuthService from "../services/authService";
import UserAuthResource from "../resources/userAuthResource";
import CustomHelper from "../helpers/customHelper";
import UserService from "../services/userService";
import UserListResource from "../resources/userListResource";

class AuthController {
  /**
   * User Registration
   * @param {*} req
   * @param {*} res
   */

  static async register(req, res) {
    try {
      const data = req.body || {};

      const register = await AuthService.register(data);

      return CustomHelper.success(res, "Otp sent successfully.", await new UserListResource(register));
    } catch (error) {
      return CustomHelper.error(res, error.message || "Registration failed");
    }
  }

  /**
   * User Login
   * @param {*} req
   * @param {*} res
   */
  static async login(req, res) {
    try {
      const data = req.body || {};

      const login = await AuthService.login(data);

      return CustomHelper.success(res, "User logged in successfully", await new UserAuthResource(login));
    } catch (error) {
      return CustomHelper.error(res, error.message || "Login failed");
    }
  }

  /**
   * Send OTP
   * @param {*} req
   * @param {*} res
   */
  static async sendOtp(req, res) {
    try {
      const data = req.body || {};

      const sendOtp = await AuthService.sendOtp(data);

      if (sendOtp) {
        return CustomHelper.success(res, "OTP sent successfully");
      } else {
        return CustomHelper.error(res, "Something went wrong. Please try again.");
      }
    } catch (error) {
      return CustomHelper.error(res, error.message || "Send OTP failed");
    }
  }

  /**
   * Verify OTP
   * @param {*} req
   * @param {*} res
   */
  static async verifyOtp(req, res) {
    try {
      const data = req.body || {};

      const verifyOtp = await AuthService.verifyOtp(data);

      if (verifyOtp) {
        if (data.is_forgot_password_flow) {
          return CustomHelper.success(res, "OTP verified successfully");
        } else {
          return CustomHelper.success(res, "OTP verified successfully", await new UserAuthResource(verifyOtp));
        }
      } else {
        return CustomHelper.error(res, "Something went wrong. Please try again.");
      }
    } catch (error) {
      return CustomHelper.error(res, error.message || "Verify OTP failed");
    }
  }

  /**
   * Logout
   * @param {*} req
   * @param {*} res
   */
  static async logout(req, res) {
    try {
      const data = {
        reqData: req.body,
        authUser: req.user,
      }

      const logout = await AuthService.logout(data);

      return CustomHelper.success(res, "User logged out successfully");
    } catch (error) {
      return CustomHelper.error(res, error.message || "Logout failed");
    }
  }

  /**
   * Reset Password
   * @param {*} req
   * @param {*} res
   */
  static async resetPassword(req, res) {
    try {
      const data = req.body || {};

      const resetPassword = await AuthService.resetPassword(data);

      return CustomHelper.success(res, "Password reset successfully", await new UserAuthResource(resetPassword));
    } catch (error) {
      return CustomHelper.error(res, error.message || "Reset Password failed");
    }
  }
}

export default AuthController;
