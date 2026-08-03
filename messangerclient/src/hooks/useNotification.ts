import { toast } from "react-toastify";
import { urlBase64ToUint8Array } from "../utils/urlBase64ToUnit8Array";
import { _post } from "../Service/axios";
import { SUBSCRIBE_NOTIFICATION } from "../Service/useApiService";

const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

const savedSubscription = async (subscriptionId: PushSubscription) => {
  const payload = {
    subscriptionId,
  };
  await _post<any>(SUBSCRIBE_NOTIFICATION, payload);
  console.log("Subscription saved successfully.");
};

export const subscribedUser = async () => {
  if (!("serviceWorker" in navigator)) {
    toast.error("Service Worker not Supported.");
    return;
  }

  if (!("PushManager" in window)) {
    toast.error("Push API not Supported.");
    return;
  }

  const permission = await Notification.requestPermission();
  console.log({permission});
  
  if (permission !== "granted") {
    toast.error("Notification permission Denied.");
    return;
  }
  const registration = await navigator.serviceWorker.register("/sw.js");

  console.log("Service Worker Registered");

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
    });
  }
  await savedSubscription(subscription);

  return subscription;
};
