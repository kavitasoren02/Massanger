import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "../../../ProtectedRoute/AuthProvider";

interface ChatContextProps {
  socket: Socket | undefined;
  isSocketConnected: boolean;
}

const ChatProviderContext = createContext<ChatContextProps | undefined>(
  undefined,
);

export const ChatContextProvider = ({ children }: PropsWithChildren) => {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    console.log("Creating socket...");

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
      setIsSocketConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };

  }, [user]);

  return (
    <ChatProviderContext.Provider
      value={{
        socket,
        isSocketConnected,
      }}
    >
      {children}
    </ChatProviderContext.Provider>
  );
};

export const useChatContextProvider = () => {
  const context = useContext(ChatProviderContext);

  if (!context) {
    throw new Error(
      "useChatContextProvider must be use within a Chat Context Provider",
    );
  }
  return context;
};
