import UserService from "../services/userService";
import UserListResource from "../resources/userListResource";
import CustomHelper from "../helpers/customHelper";
import User from "../../model/user";
import { timeZoneMap } from "../config/constant";

class UserController {
  static async profile(req, res) {
    let id = req.query.id || req.user.id;

    try {
      // update the timezone of the user
      if (req.query.timezone) {
        // Map timezones
        const timezone = timeZoneMap[req.query.timezone] || req.query.timezone;

        await User.update(
          {
            timezone: timezone,
          },
          {
            where: {
              id: req.user.id,
            },
          }
        );
      }

      const user = await UserService.getUser(id);

      const userResource = await new UserListResource(user);

      return CustomHelper.success(
        res,
        "User profile fetched successfully.",
        userResource
      );
    } catch (error) {
      return CustomHelper.error(
        res,
        error.message || "User profile fetch failed."
      );
    }
  }

  static async infoUpdate(req, res) {
    try {
      const user = await UserService.updateUser(
        req.user.id,
        req.body,
        req.file
      );

      if (user) {
        return CustomHelper.success(
          res,
          "User info updated successfully.",
          await new UserListResource(user)
        );
      }
      return CustomHelper.error(res, "Something went wrong. Please try again.");
    } catch (error) {
      return CustomHelper.error(
        res,
        error.message || "User info update failed."
      );
    }
  }

  static async changePassword(req, res) {
    try {
      const user = await UserService.changePassword(req.user.id, req.body);

      if (user) {
        return CustomHelper.success(
          res,
          "Password changed successfully.",
          await new UserListResource(user)
        );
      }
      return CustomHelper.error(res, "Something went wrong. Please try again.");
    } catch (error) {
      return CustomHelper.error(
        res,
        error.message || "Password change failed."
      );
    }
  }

  static async deleteAccount(req, res) {
    try {
      const user = await UserService.deleteUser(req.user.id);

      if (user) {
        return CustomHelper.success(res, "Account deleted successfully.");
      }
      return CustomHelper.error(res, "Something went wrong. Please try again.");
    } catch (error) {
      return CustomHelper.error(
        res,
        error.message || "Account deletion failed."
      );
    }
  }
}

export default UserController;
