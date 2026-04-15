import jwt, { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export const AuthSocketMiddleware = (socket: Socket, next: any) => {
  try {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) {
      return next(new Error("Unauthorise Access"));
    }

    const cookieArray = cookies.split(";").map((c) => c.trim());
    const tokenCookie = cookieArray.find((c) => c.startsWith("token="));

    if (!tokenCookie) {
      return next(new Error("Token not found"));
    }

    const token = tokenCookie.split("=")[1] as string;

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    socket.data.userId = decoded.userId;

    next();
  } catch (error: any) {
    console.log("Socket Auth Error:", error.message);

    // throw new Error(error);

    next(new Error("Unauthorise Access"));
  }
};
