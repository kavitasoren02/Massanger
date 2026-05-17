import { READ_STATUS } from "../enums/ReadStatus";
import MessageModel, { IMESSAGE } from "./modals/Message";

export const getAllMessage = async (
  senderIdProps: string,
  receiverIdProps: string,
) => {
  try {
    const allMessage = await MessageModel.find({
      $or: [
        { senderId: senderIdProps, receiverId: receiverIdProps },
        { senderId: receiverIdProps, receiverId: senderIdProps },
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

export const bluetickMessage = async(ids: string[]) => {
  if(ids.length <= 0) return;

  try{
    const id = await MessageModel.updateMany(
      {
        _id:{
          $in: ids
        }
      },
      {
        $set:{
          readStatus: READ_STATUS.BLUE_DOUBLE_TICK
        }
      }
    )
  }catch(error){
    throw error;
  }
}