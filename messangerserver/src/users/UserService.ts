import * as bcrypt from "bcryptjs";
import UserModal from "./modals/User";

export const registerUser = async (data: any) => {
  try {
    const { firstName, lastName, email, mobileNumber, password } = data;

    const exisistingUser = await UserModal.findOne({ email });

    if (exisistingUser) {
      throw new Error("Email already exsists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModal.insertOne({
      firstName,
      lastName,
      email,
      mobileNumber,
      password: hashedPassword,
    });
    return newUser;
  } catch (error) {
    throw error;
  }
};
