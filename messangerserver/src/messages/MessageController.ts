import express, { Request, Response } from "express";
import { deleteMessage, getAllMessage, updateMessage } from "./MessageService";
import { IMESSAGE } from "./modals/Message";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.query;
    
    if (!senderId || !receiverId) throw new Error("Please provide me Sender and Reciever id");

    const allMessage = await getAllMessage(senderId as string, receiverId as string);

    res.status(200).json({
      message: "Messaged fetched successfully",
      data: allMessage,
    });
  } catch (error: any) {
    console.log({error})
    return res.status(500).json({
      detail: error.message || "Something went wrong",
    });
  }
});

router.put("/:id", async (req: any, res: Response) => {
  try {
    const message: IMESSAGE = req.body;
    const { id } = req.params;
    const currentUserId = req.userId;

    const updatedMessage = await updateMessage(id, message, currentUserId);

    res.status(200).json({
      message: "Message updated successfully",
      data: updatedMessage,
    });
  } catch (error: any) {
    return res.status(500).json({
      detail: error.message || "Something went wrong",
    });
  }
});

router.delete("/:id", async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.userId;

    const deletedMessage = await deleteMessage(id, currentUserId);
    res.status(200).json({
      message: "Message deleted successfully",
      data: deletedMessage,
    });
  } catch (error: any) {
    return res.status(500).json({
      detail: error.message || "Something went wrong",
    });
  }
});

export default router;