import mongoose, { model } from "mongoose";

const schema = new mongoose.Schema(
  {
    board: {
      type: JSON,
      default: () => [null, null, null, null, null, null, null, null, null],
    },
    state: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Game", schema);
