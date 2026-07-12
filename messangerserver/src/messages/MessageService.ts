import mongoose, { PipelineStage } from "mongoose";
import { READ_STATUS } from "../enums/ReadStatus";
import MessageModel, { IMESSAGE } from "./modals/Message";
import { doubleTickProps } from "../interface/interface";

export const getAllMessage = async (
  senderIdProps: string,
  recieverIdProps: string,
) => {
  try {
    const allMessage = await MessageModel.find({
      $or: [
        { senderId: senderIdProps, recieverId: recieverIdProps },
        { senderId: recieverIdProps, recieverId: senderIdProps },
      ],
    }).sort({ createdAt: 1 });
    return allMessage;
  } catch (error) {
    throw error;
  }
};

export const updateMessage = async (
  id: string,
  message: IMESSAGE,
  currentId: string,
) => {
  try {
    const isOwnMessage = await MessageModel.find({
      _id: id,
      senderId: currentId,
    });
    if (!isOwnMessage) {
      throw new Error("Access Denied");
    }
    const updatedMessage = await MessageModel.findByIdAndUpdate(id, message, {
      $new: true,
    });
    return updatedMessage;
  } catch (error) {
    throw error;
  }
};

export const deleteMessage = async (id: string, currentId: string) => {
  try {
    const isOwnMessage = await MessageModel.find({
      _id: id,
      senderId: currentId,
    });
    if (!isOwnMessage) {
      throw new Error("Access Denied");
    }
    const deletedMessage = await MessageModel.findByIdAndDelete(id);
    return deletedMessage;
  } catch (error) {
    throw error;
  }
};

export const saveMessage = async (message: IMESSAGE) => {
  try {
    const userMessage = await MessageModel.insertOne(message);
    return userMessage;
  } catch (error) {
    throw error;
  }
};

export const bluetickMessage = async (ids: string[]) => {
  if (ids.length <= 0) return;

  try {
    const id = await MessageModel.updateMany(
      {
        _id: {
          $in: ids,
        },
      },
      {
        $set: {
          readStatus: READ_STATUS.BLUE_DOUBLE_TICK,
        },
      },
    );
  } catch (error) {
    throw error;
  }
};

export const getAllRecievedMessage = async (
  recieverId: string,
): Promise<doubleTickProps[]> => {
  try {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          recieverId: new mongoose.Types.ObjectId(recieverId),
          readStatus: READ_STATUS.SINGLE_TICK,
        },
      },
      {
        $group: {
          _id: "$senderId",
          recieverId: { $first: "$recieverId" },
          messageIds: {
            $push: "$_id",
          },
        },
      },
    ];
    const result = await MessageModel.aggregate(pipeline);
    return result;
  } catch (error) {
    throw error;
  }
};

export const updatedoubleTick = async (messageIds: string[]) => {
  if (messageIds.length <= 0) return;

  const ids = await MessageModel.updateMany(
    {
      _id: {
        $in: messageIds,
      },
    },
    {
      $set: {
        readStatus: READ_STATUS.DOUBLE_TICK,
      },
    },
  );
};

export const lastMessageByUserId = async (
  recieverId: string,
  senderId: string,
) => {
  try {
    const lastMessage = await MessageModel.findOne({
      $or: [
        {
          senderId,
          recieverId,
        },
        {
          senderId: recieverId,
          recieverId: senderId,
        },
      ],
    }).sort({ createdAt: -1 });

    return lastMessage;
  } catch (error) {
    throw error;
  }
};

export const getUnseenMessageCount = async (
  recieverId: string,
  senderId: string,
) => {
  try{
    const unseenMessage = await MessageModel.find({
      senderId,
      recieverId,
      readStatus: {
        $in: [
          READ_STATUS.DOUBLE_TICK, READ_STATUS.SINGLE_TICK
        ]
      }
    })
    return unseenMessage.length;
  }catch(error){
    throw error;
  }
};
