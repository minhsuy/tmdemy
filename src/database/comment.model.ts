import { ECommentStatus } from "@/types/enums";
import mongoose, { Document, models, Schema } from "mongoose";
export interface IComment extends Document {
  _id: string;
  content: string;
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  lesson: Schema.Types.ObjectId;
  status: ECommentStatus;
  createdAt: string;
  parentId: Schema.Types.ObjectId;
  level: number;
}
const commentSchema = new mongoose.Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
    status: {
      type: String,
      enum: Object.values(ECommentStatus),
      default: ECommentStatus.ACTIVE,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    level: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Comment = models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;
