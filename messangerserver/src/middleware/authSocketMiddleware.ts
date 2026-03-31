import jwt, { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export const AuthSocketMiddleware = (socket: Socket, next: any) => {
    try{
        const cookies = (socket.handshake.headers?.cookie ?? "").split("=")[1];
        if (!cookies) {
            throw new Error("Unauthorise Access.");
        }
        const decoded = jwt.verify(cookies, JWT_SECRET) as JwtPayload;
        socket.data.userId = decoded.userId;
        next();
    }
    catch (error: any) {
        console.log({error})
        throw new Error(error)
    }
}