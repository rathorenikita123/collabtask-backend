import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, default: null },
    passwordHash: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    role: { type: String, enum: ["Admin", "Member"], default: "Member" },
  },
  { timestamps: true }
);

export default model("User", userSchema);
