import {
  NotFoundException,
} from "../config/errorException";
import FcmToken from "../../model/fcmToken";
import Notification from "../../model/notification";
import moment from "moment";
import AppVersion from "../../model/appVersion";

class CommonService {
  static async storeFcmToken(authUserId, data) {
    // check if fcm token is already stored
    const isFcmToken = await FcmToken.findOne({ where: {
      user_id: authUserId,
      device_id: data.device_id,
    } });
    if (isFcmToken) {
      // update fcm token
      const fcmToken = await FcmToken.update({
        token: data.token,
      }, {
        where: {
          id: isFcmToken.id,
        },
      });
      return fcmToken;
    }

    const fcmToken = await FcmToken.create({
      user_id: authUserId,
      token: data.token,
      device_type: data.device_type,
      device_id: data.device_id,
    });
    return fcmToken;
  }

  static async getNotification(authUserId, { page = 1, paginate = 25 }) {
    // Get unread notification count
    await Notification.update({
      seen_at: moment().format('YYYY-MM-DD HH:mm:ss')
    }, {
      where: {
        user_id: authUserId,
      },
    });

    const notification = await Notification.findAll({
      where: {
        user_id: authUserId,
      },
      order: [["id", "DESC"]],
      limit: parseInt(paginate),
      offset: (parseInt(page) - 1) * parseInt(paginate),
    });
    return notification;
  }

  static async appVersion(data) {
    const { platform, version } = data;
    
    const checkData = await AppVersion.findOne({ where: { platform: platform } });
    
    if (checkData) {
      const min_version = checkData.min_version;
      const current_version = checkData.version;
      
      const responseData = {
        app_link: checkData.app_link
      };
      
      if (min_version > version) {
        responseData.status = 1;
        responseData.message = 'Update Forcefully.';
        return responseData;
      } else if (current_version > version) {
        responseData.status = 2;
        responseData.message = 'Recommend to update.';
        return responseData;
      } else {
        responseData.status = 0;
        responseData.message = 'Already up to date.';
        return responseData;
      }
    }
    
    throw new NotFoundException('App version not found.');
  }
}

export default CommonService;
