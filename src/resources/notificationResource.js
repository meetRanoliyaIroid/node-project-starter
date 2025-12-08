import { baseUrl } from "../config/constant";

export default class NotificationResource {
  constructor(data, authUserId) {
    return (async () => {
      if (!data || !Array.isArray(data)) {
        return [];
      }

      return Promise.all(data.map(async (notification) => {
        return {
          id: notification.id,
          title: notification.title,
          description: notification.description,
          type: notification.type,
          image: notification.image ? baseUrl(notification.image) : null,
          data_id: notification.data_id || null,
          created_at: +notification.created_at
        };
      }));
    })();
  }
}