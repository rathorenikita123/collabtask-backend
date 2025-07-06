import { Schema, model } from "mongoose";

const boardSchema = new Schema(
  {
    name: { type: String, required: true },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Board", boardSchema);
