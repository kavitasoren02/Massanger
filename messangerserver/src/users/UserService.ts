import * as bcrypt from "bcryptjs";
import UserModal from "./modals/User";
import { Types } from "mongoose";
import crypto from 'crypto';

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
    const resetToken = crypto.randomBytes(32).toString('hex');

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
