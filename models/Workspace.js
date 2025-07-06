import { Schema, model } from "mongoose";

const workspaceSchema = new Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default model("Workspace", workspaceSchema);

 