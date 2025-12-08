import axios from "axios";
import { GoogleAuth } from "google-auth-library";
import path from "path";
import FcmToken from "../../model/fcmToken";
import Notification from "../../model/notification";
import { baseUrl } from "../config/constant";

// Load Firebase access token from service account
async function getFirebaseAccessToken() {
  const serviceAccountPath = path.join(process.cwd(), "stackt-notification.json");

  try {
    const auth = new GoogleAuth({
      keyFile: serviceAccountPath,
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    return tokenResponse.token;
  } catch (error) {
    console.error("Error getting Firebase access token:", error.message);
    return null;
  }
}

// Simulate fetching FCM tokens from DB for the user
async function getUserFcmTokens(userId) {
    const fcmTokens = await FcmToken.findAll({
        where: {
            user_id: userId,
        },
        attributes: ['token'],
    });

    let tokens = [];
    for (const fcmToken of fcmTokens) {
        if (fcmToken.token != null && !tokens.includes(fcmToken.token)) {
            tokens.push(fcmToken.token);
        }
    }

    return tokens;
}

// Send FCM notification
export async function sendNotification(userId, title, description, type, image = null, dataId = 0) {
  const bearerToken = await getFirebaseAccessToken();
  if (!bearerToken) {
    console.error("Firebase token is missing.");
    return false;
  }

  // store notification in database
  await Notification.create({
    user_id: userId,
    title: title,
    description: description,
    type: type,
    image: image || undefined,
    data_id: dataId,
  });

  const firebaseTokens = await getUserFcmTokens(userId);
  if (!firebaseTokens || firebaseTokens.length === 0) {
    console.warn("No FCM tokens found for user:", userId);
    return false;
  }

  const extraParameters = {
    type: String(type),
    data_id: String(dataId)
  };

  for (const token of firebaseTokens) {
    const notificationData = {
      message: {
        token: token,
        notification: {
          title: title,
          body: description,
          image: image ? baseUrl(image) : null,
        },
        android: {
          notification: {
            sound: "default"
          }
        },
        apns: {
          payload: {
            aps: {
              sound: "default"
            }
          }
        },
        data: extraParameters,
      },
    };

    try {
      const response = await axios.post(
        "https://fcm.googleapis.com/v1/projects/stackt-37674/messages:send",
        notificationData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
    } catch (error) {
      console.error(
        `Failed to send notification to ${token}:`,
        error.response?.data || error.message
      );
    }
  }
}
