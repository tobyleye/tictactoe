import mongoose from "mongoose";
import Game from "./models/game.js";

async function connectDB() {
  await mongoose.connect("mongodb://127.0.0.1:27017/tictactoe");
}

connectDB();
