import mongoose, { Document, Schema } from "mongoose";
import MessageModel, { IMESSAGE } from "../../messages/modals/Message";

export interface IUSER extends Document {
  fullName: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  password: string;
  profilePic?: string;
  status?: string;
  isOnline?: Boolean | null;
  lastSeen?: Date;
  isActive: boolean;
  isDeleted: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date | string;
  lastMessage: IMESSAGE;
}

const UserSchema: Schema<IUSER> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: (v: string) => /\S+@\S+\.\S+/.test(v),
        message: (props: any) => `${props.value} is not a valid email`,
      },
    },

    countryCode: {
      type: String,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: (v: string) => /^\d{10}$/.test(v),
        message: (props: any) => `${props.value} is not a valid number`,
      },
    },

    password: {
      type: String,
      required: true,
      minLength: 8,
    },

    profilePic: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Hey there!, I'm Using Messanger",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }
  },
  {
    timestamps: true,
  },
);

const UserModal = mongoose.model<IUSER>("User", UserSchema);

export default UserModal;
