import { Schema, model } from "mongoose";

const columnSchema = new Schema(
  {
    name: { type: String, required: true },
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model("Column", columnSchema);
