import mongoose from "mongoose";

const mongoURL = process.env.MONGO_URL ?? "mongodb://127.0.0.1:27017";

async function connectDB() {
  await mongoose.connect(mongoURL);
}

connectDB();
