// @ts-ignore
import { Server } from "socket.io";
import express from "express";
import { Room, rooms } from "./Room";

const app = express();
const PORT = process.env.PORT ?? 5201;

const server = app.listen(PORT);

const io = new Server(server, {
  cors: {},
});

// for testing
new Room(io, "x", "public");

io.on("connection", (socket) => {
  socket.on("newGame", (hostMark, cb) => {
    const room = new Room(io, hostMark);
    cb(room.roomId);
  });

  socket.on("joinRoom", (roomId: string, cb) => {
    // grab room
    const room = rooms.get(roomId);
    if (!room) {
      return cb(null);
    }

    room.join(socket, (roomState: any) => {
      cb(roomState);
    });
  });
});
