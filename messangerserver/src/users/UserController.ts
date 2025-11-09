import express, { Request, Response } from "express";
import { registerUser } from "./UserService";
import { validateUser } from "./validation/validateUser";

const router = express.Router();

router.post("/register", validateUser, async (req: Request, res: Response) => {
  try {
    const newUser = await registerUser(req.body);
    // console.log("Saved User:", newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
});

export default router;
