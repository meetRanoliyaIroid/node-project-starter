import User from "../../model/user";
import { NotFoundException } from "../config/errorException";
import AuthHelper from "../helpers/authHelper";
import { BadRequestException } from "../config/errorException";
import fs from "fs";

class UserService {
  static async getUser(id) {
    const user = await User.findOne({ where: { id: id } });
    return user;
  }

  static async updateUser(id, data, file) {
    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Only handle profile image if a new file is uploaded
    if (file && file.filename) {
      // Delete the old profile image if it exists
      if (user.profile && fs.existsSync(user.profile)) {
        fs.unlinkSync(user.profile);
      }
      // Store the new profile image path
      data.profile = `media/profile/${file.filename}`;
    } else {
      // If no new file, do not update the profile field
      delete data.profile;
    }

    const updatedUser = await User.update(data, {
      where: {
        id: id,
      },
    });
    return updatedUser;
  }

  static async changePassword(id, data) {
    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // check if the old password is correct
    if (
      !(await AuthHelper.checkUserPassword(data.old_password, user.password))
    ) {
      throw new BadRequestException("Old password is incorrect");
    }

    // hash the new password
    const hashedPassword = await AuthHelper.getHashPassword(data.password);

    // update the password
    const updatedUser = await User.update(
      { password: hashedPassword },
      {
        where: {
          id: id,
        },
      }
    );
    return updatedUser;
  }

  static async deleteUser(id) {
    // delete the user's profile image
    const user = await User.findOne({ where: { id: id } });
    if (user.profile) {
      fs.unlinkSync(user.profile);
    }

    // delete the user
    const deletedUser = await User.destroy({
      where: {
        id: id,
      },
    });

    return deletedUser;
  } 
}

export default UserService;
