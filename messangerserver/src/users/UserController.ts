import express, { Request, Response } from "express";
import {
  changePassword,
  forgotPassword,
  getAllUser,
  registerUser,
  validateToken,
} from "./UserService";
import { validateUser } from "./validation/validateUser";
import { sendMail } from "../utils/sendEmail";
import UserModal from "./modals/User";
import { UserSocketStoreInstance } from "../messages/Socket/UserSocketStore";
import { AuthSocketMiddleware } from "../middleware/authSocketMiddleware";
import { authenticate } from "../middleware/authMiddleware";

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
      error: error.message || "Failed to register user",
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

    const html = `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password.</p>
      <p>Click the link below:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
      <br/>
      <p>If you didn’t request this, ignore this email.</p>
    `;

    // console.log(" RESET PASSWORD LINK:", resetLink);

    await sendMail(email, "Reset your password", html);

    return res.status(200).json({
      message: "Password reset link sent successfully",
      // resetLink,
    });
  } catch (error: any) {
    return res.status(500).json({
      detail: error.message || "Forgot password failed",
    });
  }
});

router.get(
  "/validate-reset-token/:token",
  async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          detail: "Reset token is required",
        });
      }

      await validateToken(token);

      return res.status(200).json({ message: "Reset token is valid " });
    } catch (error: any) {
      return res.status(500).json({
        message: "Invalid or expired token",
        detail: error.message || "Invalid or expired token",
      });
    }
  },
);

router.post("/change-password/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    await changePassword(token, password);

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message:  "Password reset failed",
      detail: error.message ||  "Password reset failed",
    });
  }
});

router.get("/all-users", authenticate, async (req: any, res: Response) => {
  try{
    const currentUserId = req.userId;
    const users = await getAllUser(currentUserId);
    res.status(200).json({
      data: users
    });
  }
  catch (error: any) {
    return res.status(500).json({
      message: "Internal server error.",
      details: error.message || "Internal server error."
    }) 
  }
})

export default router;
