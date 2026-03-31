import * as bcrypt from "bcryptjs";
import UserModal from "./modals/User";
import { Types } from "mongoose";
import crypto from "crypto";
import { UserSocketStoreInstance } from "../messages/Socket/UserSocketStore";
import { Response } from "express";

export const registerUser = async (data: any) => {
  try {
    const { fullName, email, countryCode, mobileNumber, password } = data;

    const exisistingUser = await UserModal.findOne({ email });

    if (exisistingUser) {
      throw new Error("Email already exsists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModal.insertOne({
      fullName,
      email,
      countryCode,
      mobileNumber,
      password: hashedPassword,
    });
    return newUser;
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    return await UserModal.findOne({ email, isDeleted: false, isActive: true });
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id: string | Types.ObjectId) => {
  try {
    return await UserModal.findById(id);
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const user = await UserModal.findOne({
      email,
      isDeleted: false,
      isActive: true,
    });

    if (!user) {
      throw new Error("User with this email does not exist");
    }
    //generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    //hashed token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    //save token & expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();
    return {
      resetToken,
      userId: user._id,
    };
  } catch (error: any) {
    throw error;
  }
};

export const validateToken = async (token: string) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await UserModal.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
      isActive: true,
      isDeleted: false,
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    return true;
  } catch (error: any) {
    throw error;
  }
};

export const changePassword = async (token: string | undefined, newPassword: string) => {
  try {
    if (!token) {
      throw new Error("Invalid or expired reset token");
    }
    
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await UserModal.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
      isActive: true,
      isDeleted: false,
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = "";

    await user.save();

    return true;
  } catch (error: any) {
    throw error;
  }
};

export const getAllUser = async (currentUserId: string) => {
  const users = await UserModal.find({isActive: true, _id: { $ne: currentUserId }});
    if (!users || users.length <= 0) {
      throw new Error("There is no any registered user.");
    }

    const onlineOfflineUser = users.map((user) => {
      const isOnline: boolean = !!UserSocketStoreInstance.getSocketId(user.id);
      return {
        ...user.toObject(), 
        isOnline: isOnline
      }
    })
    console.log({onlineOfflineUser})
    return onlineOfflineUser;
}