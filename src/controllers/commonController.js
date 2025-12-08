import CommonService from "../services/commonService";
import CustomHelper from "../helpers/customHelper";
import NotificationResource from "../resources/notificationResource";

class CommonController {
    static async storeFcmToken(req, res) {
        // Fetch Auth User Id
        const authUserId = req.user.id || null;
        try {
            const fcmToken = await CommonService.storeFcmToken(authUserId, req.body);

            if (fcmToken) {
                return CustomHelper.success(res, "Fcm token stored successfully.");
            }

            return CustomHelper.error(res, "Something went wrong. Please try again.");
        } catch (error) {
            return CustomHelper.error(res, error.message || "Fcm token store failed.");
        }
    }

    static async getNotification(req, res) {
        // Fetch Auth User Id
        const authUserId = req.user.id || null;
        try {
            const { data, meta } = await CommonService.getNotification(authUserId, req.query);

            return CustomHelper.success(res, "Notification fetched successfully.", await new NotificationResource(data, authUserId), meta);
        } catch (error) {
            return CustomHelper.error(res, error.message || "Notification fetch failed.");
        }
    }

    static async appVersion(req, res) {
        try {
            const appVersion = await CommonService.appVersion(req.body);
            return CustomHelper.success(res, "App version fetched successfully.", appVersion);
        } catch (error) {
            return CustomHelper.error(res, error.message || "App version fetch failed.");
        }
    }
}

export default CommonController;