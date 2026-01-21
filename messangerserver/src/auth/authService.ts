import * as bcrypt from "bcryptjs";
import { getUserByEmail, getUserById } from "../users/UserService";
import JWT from "jsonwebtoken";
import { removeCookie, setCookie } from "./cookie";
import UserModal from "../users/modals/User";

export const loginUser = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = JWT.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" },
    );

    setCookie(res, "token", token);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const logoutUser = async (req: any, res: any) => {
  removeCookie(res, "token");
  res.status(200).json({ message: "Logout Successfuly" });
};

export const getUserInfo = async (req: any, res: any) => {
  const id = req.userId;
  const user = await getUserById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
};
