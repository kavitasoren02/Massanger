import { Server, Socket } from "socket.io";
import { AuthSocketMiddleware } from "../../middleware/authSocketMiddleware";
import { UserSocketStoreInstance } from "./UserSocketStore";

export const SocketProvider = (io: Server) => {
  if (!io) return;

  io.use(AuthSocketMiddleware);

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);
    const currentUserId = socket.data.userId;
    UserSocketStoreInstance.addUser(currentUserId, socket.id);

    socket.broadcast.emit("topic/userConnected", {
      userId: currentUserId,
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
      UserSocketStoreInstance.removeUser(socket.id);

      socket.broadcast.emit("topic/userDisconnected", {
        userId: currentUserId,
      });
    });
  });
};
