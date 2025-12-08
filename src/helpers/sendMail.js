import mailer from "../config/mailer";
import { APP_NAME, MAIL_USERNAME, baseUrl } from "../config/constant";
import ejs from "ejs";
import path from "path";

export default async function sendMail(to, subject, template, data = {}) {
    try {
        data.logo = baseUrl("asset/image/app_logo.png");
        const html = await ejs.renderFile(path.join(__dirname, '../..', 'views', 'mail', template), data);

        const mailOptions = {
            from: `${APP_NAME} <${MAIL_USERNAME}>`,
            to: to,
            subject: subject,
            html: html
        }
    
        const info = await mailer.sendMail(mailOptions);
    
        return info;
    } catch (error) {
        console.log(error);
        return false;
    }
}