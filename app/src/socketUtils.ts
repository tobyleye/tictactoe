import { Socket } from "socket.io-client";

export const registerEvents = (
  socket: Socket,
  events: { [x: string]: (...args: any) => void }
) => {
  for (let event in events) {
    socket.on(event, events[event]);
  }

  return () => {
    for (let event in events) {
      socket.off(event, events[event]);
    }
  };
};
