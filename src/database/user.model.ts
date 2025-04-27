import { EUserRole, EUserStatus } from "@/types/enums";
import { IUser } from "@/types/type";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema<IUser>(
  {
    clerkId: {
      type: String,
    },
    name: {
      type: String,
    },
    username: {
      type: String,
    },
    email_address: {
      type: String,
      unique: true,
    },
    avatar: {
      type: String,
    },
    course: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Course",
      },
    ],
    role: {
      type: String,
      enum: Object.values(EUserRole),
      default: EUserRole.USER,
    },
    status: {
      type: String,
      enum: Object.values(EUserStatus),
      default: EUserStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
