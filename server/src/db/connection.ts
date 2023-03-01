import mongoose from "mongoose";

const mongoURL = process.env.MONGO_URL ?? "mongodb://127.0.0.1:27017";

const connectionURL = `${mongoURL}/tictactoe`;

async function connectDB() {
  await mongoose.connect(connectionURL);
}

connectDB();
