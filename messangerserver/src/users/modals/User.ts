import mongoose, { Document, Schema } from "mongoose";

export interface IUSER extends Document {
  firstName: String;
  lastName: String;
  email: String;
  mobileNumber: String;
  password: String;
  profilePic?: String;
  status?: String;
  isOnline?: Boolean;
  lastSeen?: Date;
}

const UserSchema: Schema<IUSER> = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (v: string) => /\S+@\S+\.\S+/.test(v),
        message: (props: any) => `${props.value} is not a valid email`,
      },
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
  },
  {
    timestamps: true,
  }
);

const UserModal = mongoose.model<IUSER>('User', UserSchema);

export default UserModal;