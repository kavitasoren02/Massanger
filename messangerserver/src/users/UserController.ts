import express, { Request, Response } from "express";
import { forgotPassword, registerUser } from "./UserService";
import { validateUser } from "./validation/validateUser";
import { log } from "console";

const router = express.Router();

router.post("/register", validateUser, async (req: Request, res: Response) => {
  try {
    const newUser = await registerUser(req.body);
    // console.log("Saved User:", newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
});

router.post("/forgotpassword", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        detail: "Email is required",
      });
    }

    const result = await forgotPassword(email);

    const resetLink = `${process.env.FRONTEND_URI}/reset-password/${result.resetToken}`;

    console.log(" RESET PASSWORD LINK:", resetLink);

    return res.status(200).json({
      message: "Password reset link sent successfully",
      resetLink,
    });
  } catch (error: any) {
    return res.status(400).json({
      detail: error.message || "Forgot password failed",
    });
  }
});

export default router;
