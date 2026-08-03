import webpush from "../config/vapid";

const notificationIds = new Map();

export const saveSubscription = async (userId: string, subscriptionId: any) => {
  notificationIds.set(userId, subscriptionId);
};

export const sendNotification = async (recieverId: string, message: string) => {
  const subscriptionId = notificationIds.get(recieverId);
  // console.log(subscriptionId, recieverId);
  
  if (!subscriptionId) return;

  await webpush.sendNotification(
    subscriptionId,
    JSON.stringify({ title: "New Message", body:message }),
  );
};
