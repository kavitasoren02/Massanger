import express, { Request, Response } from "express";
import { saveSubscription } from "./NotificationService";

const router = express.Router();

router.post("/subscribe", (req: any, res: Response) => {
  try {
    const { subscriptionId } = req.body;
    const currentUserId = req.userId;

    if (!subscriptionId)
      return res.status(404).json({ message: "SubscriptionId not found" });
    saveSubscription(currentUserId, subscriptionId);
    return res.status(200).json({ message: "Subscription saved successfully" });
  } catch (error: any) {
    console.log({ error });
    return res.status(500).json({
      detail: error.message || "Something went wrong",
    });
  }
});

export default router;
