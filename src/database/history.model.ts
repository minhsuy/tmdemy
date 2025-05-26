import mongoose, { models, Schema } from "mongoose";

export interface IHistory {
  _id: string;
  course: Schema.Types.ObjectId;
  lesson: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
}
const historySchema = new mongoose.Schema<IHistory>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const History = models.History || mongoose.model("History", historySchema);
export default History;
