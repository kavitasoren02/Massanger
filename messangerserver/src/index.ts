import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectToMongo } from "./config/db";
import { Server } from "socket.io";
import http from 'http';
import mainRoute from "./routes/mainRoute";
import { SocketProvider } from "./messages/Socket/SocketProvider";

connectToMongo();

const app = express();
const PORT = process.env.PORT || 5000;

//http server
const server = http.createServer(app);

//socket server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URI ||"http://localhost:5173",
    credentials: true,
  },
});

// app.use(cors())
app.use(
  cors({
    origin: process.env.FRONTEND_URI || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

SocketProvider(io);

app.use("/api/v1", mainRoute);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
