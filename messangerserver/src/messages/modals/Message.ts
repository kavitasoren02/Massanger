import mongoose, { Document, Schema } from "mongoose";
import { READ_STATUS, readStatus } from "../../enums/ReadStatus";

export interface IMESSAGE extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  messageType: String;
  content: String;
  fileId?: mongoose.Types.ObjectId;
  readStatus: readStatus;
}

const MessageSchema: Schema<IMESSAGE> = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messageType: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Files",
    },

    readStatus: {
      type: String,
      enum: READ_STATUS,
      default: READ_STATUS.SINGLE_TICK,
    },
  },
  {
    timestamps: true,
  },
);

const MessageModel = mongoose.model<IMESSAGE>("Message", MessageSchema);

export default MessageModel;
