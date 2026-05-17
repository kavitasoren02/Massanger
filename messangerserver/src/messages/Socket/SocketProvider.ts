import { Server, Socket } from "socket.io";
import { AuthSocketMiddleware } from "../../middleware/authSocketMiddleware";
import { UserSocketStoreInstance } from "./UserSocketStore";
import { IMESSAGE } from "../modals/Message";
import { bluetickMessage, saveMessage } from "../MessageService";
import { READ_STATUS } from "../../enums/ReadStatus";
import { BlueTickProps } from "../../interface/interface";

export const SocketProvider = (io: Server) => {
  if (!io) return;

  io.use(AuthSocketMiddleware);

  //socket connection
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);
    const currentUserId = socket.data.userId;
    UserSocketStoreInstance.addUser(currentUserId, socket.id);

    socket.broadcast.emit("topic/userConnected", {
      userId: currentUserId,
    });

    // send message & recieve message
    socket.on("topic/sendMessage", async (data: IMESSAGE) => {
      const recieverSocketId = UserSocketStoreInstance.getSocketId(
        data.receiverId.toString(),
      );
      const senderSocketId = UserSocketStoreInstance.getSocketId(
        data.senderId.toString(),
      );

      try {
        if (recieverSocketId) {
          data.readStatus = READ_STATUS.DOUBLE_TICK;
        }
        const savedMessage = await saveMessage(data);
        if (recieverSocketId) {
          socket
            .to(recieverSocketId)
            .emit("topic/receiveMessage", savedMessage);
        }
        if (senderSocketId) {
          io.to(senderSocketId).emit("topic/updateMessage", savedMessage);
        }
      } catch (error) {
        if (senderSocketId) {
          socket.to(senderSocketId).emit("topic/messageFailed", null);
        }
      }
    });

    // blue tick message
    socket.on("topic/bluetickMessage", async (data: BlueTickProps) => {
      const recieverSocketId = UserSocketStoreInstance.getSocketId(
        data.recieverId,
      );

      if (recieverSocketId) {
        socket.to(recieverSocketId).emit("topic/updateBluetickMessage", data);
      }
      
      await bluetickMessage(data.ids);
    });
    // disconnect socket
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
      UserSocketStoreInstance.removeUser(socket.id);

      socket.broadcast.emit("topic/userDisconnected", {
        userId: currentUserId,
      });
    });
  });
};
