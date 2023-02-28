import { createContext, useState } from "react";
import { io, Socket } from "socket.io-client";

const connURI = "localhost:5201";

export const SocketContext = createContext<{ socket: Socket }>({
  socket: io(connURI),
});

export default function SocketProvider({ children }: { children: any }) {
  const [socket] = useState(() => io(connURI));

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
