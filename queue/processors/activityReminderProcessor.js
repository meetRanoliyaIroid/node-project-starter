import { sendNotification } from "../../src/services/notificationService";

export default async function activityReminderProcessor(job) {
    const { userId, title, message, type, image, dataId } = job.data;

    // send notification
    await sendNotification(userId, title, message, type, image, dataId);
  }