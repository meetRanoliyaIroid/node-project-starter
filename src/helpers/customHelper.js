import twilio from "twilio";
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } from "../config/constant";

class CustomHelper {

    /**
     * Success response
     * @param {*} res
     * @param {*} message
     * @param {*} data
     * @returns
     */
    static async success(res, message, data , meta = null) {
        return res.status(200).json({   
            success: true,
            message,
            ...(data && { data }),
            ...(meta && { meta })
        });
    }

    /**
     * Error response
     * @param {*} res
     * @param {*} message
     * @returns
     */
    static async error(res, message) {
        return res.status(422).json({
            success: false,
            message
        });
    }

    /**
     * Send SMS 
     * @param {*} phoneNumber
     * @param {*} message
     * @returns
     */
    static async sendSMS(phoneNumber, message) {
        // send sms using twilio
        console.log("Send SMS : ", phoneNumber, message);
        try {
            const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
            const smsResponse = await client.messages.create({
                body: message,
                from: TWILIO_PHONE_NUMBER,
                to: phoneNumber
            });
            return smsResponse;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * Generate random string
     * @returns
     */
    static async randomStringGenerator(givenLength = 75) {
        const characters =
            givenLength > 10 ?
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
            : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const length = givenLength;
        let randomStr = "";

        for (let i = 0; i < length; i++) {
            const randomNum = Math.floor(Math.random() * characters.length);
            randomStr += characters[randomNum];
        }
        return randomStr
    }
}

export default CustomHelper;