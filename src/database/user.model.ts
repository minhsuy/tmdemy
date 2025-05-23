import { EUserRole, EUserStatus } from "@/types/enums";
import { IUser } from "@/types/type";
import mongoose, { Document, models } from "mongoose";

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
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    avatar: {
      type: String,
    },
    courses: [
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

const User = models.User || mongoose.model("User", userSchema);

export default User;
