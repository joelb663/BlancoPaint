import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    phone: {
      type: String,
      required: true,
      max: 9,
      unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      min: 6,
      max: 20,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;