import { Server, Socket } from "socket.io";
import { AuthSocketMiddleware } from "../../middleware/authSocketMiddleware";
import { UserSocketStoreInstance } from "./UserSocketStore";
import { IMESSAGE } from "../modals/Message";
import {
  bluetickMessage,
  getAllRecievedMessage,
  saveMessage,
  updatedoubleTick,
} from "../MessageService";
import { READ_STATUS } from "../../enums/ReadStatus";
import { BlueTickProps, typingProps } from "../../interface/interface";
import { debounce } from "../../utils/debounce";
import { updateLastSeen } from "../../users/UserService";

export const SocketProvider = (io: Server) => {
  if (!io) return;

  io.use(AuthSocketMiddleware);

  //socket connection
  io.on("connection", async (socket: Socket) => {
    console.log("User connected:", socket.id);
    const currentUserId = socket.data.userId;
    UserSocketStoreInstance.addUser(currentUserId, socket.id);

    socket.broadcast.emit("topic/userConnected", {
      userId: currentUserId,
    });

    // update to doubletick message
    const messageIds = await getAllRecievedMessage(currentUserId);
    const events = messageIds.map((msg) => {
      const sendersocketId = UserSocketStoreInstance.getSocketId(
        msg._id.toString(),
      );
      console.log("sendersocketid", sendersocketId, msg._id);

      if (!sendersocketId) return;

      socket.to(sendersocketId).emit("topic/updatedoubletickmessage", msg);
    });

    Promise.all(events);

    const DBevents = messageIds.map(async (msg) => {
      if (msg.messageIds.length <= 0) return;

      await updatedoubleTick(msg.messageIds);
    });

    Promise.all(DBevents);

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
          const payload = {
            senderId: data.senderId,
            recieverId: data.receiverId,
            isTyping: false,
          };
          socket
            .to(recieverSocketId)
            .emit("topic/isTyping", payload);

          socket
            .to(recieverSocketId)
            .emit("topic/receiveMessage", savedMessage);
        }
        console.log({senderSocketId, savedMessage});
        
        if (senderSocketId) {
          io.to(senderSocketId).emit("topic/updateMessage", savedMessage);
        }
      } catch (error) {
        if (senderSocketId) {
          socket.to(senderSocketId).emit("topic/messageFailed", null);
        }
      }
    });

    // typing effect
    socket.on("topic/typing", (data: typingProps) => {
      const recieverSocketId = UserSocketStoreInstance.getSocketId(
        data.receiverId,
      );

      if (!recieverSocketId) return;
      const payload = {
        senderId: data.senderId,
        recieverId: data.receiverId,
        isTyping: true,
      };
      socket.to(recieverSocketId).emit("topic/isTyping", payload);

      // debounce for stop typing effect
      const debounceFunction = debounce(() => {
        console.log("debounce", recieverSocketId);

        socket
          .to(recieverSocketId)
          .emit("topic/isTyping", { ...payload, isTyping: false });
      }, 2500);
      debounceFunction();
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

      const lastSeenDate = new Date();

      socket.broadcast.emit("topic/userDisconnected", {
        userId: currentUserId,
        lastSeenDate,
      });
      updateLastSeen(currentUserId, lastSeenDate);
    });
  });
};
