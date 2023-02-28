import { createContext, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SERVER_BASE_URL } from "@/config";

export const SocketContext = createContext<{ socket: Socket }>({
  socket: io(SERVER_BASE_URL),
});

export default function SocketProvider({ children }: { children: any }) {
  const [socket] = useState(() => io(SERVER_BASE_URL));

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
