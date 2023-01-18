import http from "http";
import { Server } from "socket.io";

const server = http.createServer((req, res) => {});

const io = new Server(server, {
  cors: {},
});

io.on("connection", (socket) => {
  console.log(`socket is connected: ${socket.id}`);
  socket.on("greet", () => {
    socket.emit("greet");
  });
});

const PORT = process.env.PORT ?? 5001;

server.listen(PORT, () => {
  console.log(`server listening on :${PORT}!`);
});
