// @ts-ignore
import { Server } from "socket.io";
import express from "express";
import "./db/connection";
import User from "./db/models/user";
import cors from "cors";
import { Room, rooms } from "./Room";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT ?? 5201;

const server = app.listen(PORT);

app.post("/signin", async (req, res) => {
  const user = req.body.user;

  if (!user) {
    res.status(400).send();
    return;
  }

  try {
    const existingUser = await User.findOne({ email: user.email }).exec();
    if (existingUser) {
      res.json({ user: existingUser });
      return;
    }

    const newUser = await User.create({
      email: user.email,
      avatar: user.image,
      name: user.name,
    });

    res.json({ user: newUser });
  } catch (err) {
    console.log("signin error:", err);
    res.status(500).json({ message: "server error 😥" });
  }
});

const dummyTopScorers = [
  { name: "parzival", score: 3000 },
  { name: "Art3mis", score: 2000 },
];

app.get("/leaderboard", async (req, res) => {
  let topScorers = await User.find({ score: { $gt: 0 } })
    .limit(10)
    .sort("score");
  let data = [...dummyTopScorers, ...topScorers].sort(
    (p1, p2) => p2.score - p1.score
  );
  res.json(data);
});

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
