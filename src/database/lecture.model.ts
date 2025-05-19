import { ECourseLevel, ECourseStatus } from "@/types/enums";
import mongoose, { models, Schema } from "mongoose";

export interface TLecture extends Document {
  _id: string;
  title: string;
  course: Schema.Types.ObjectId;
  lessons: Schema.Types.ObjectId[];
  order: number;
  _destroy: boolean;
}

const lectureSchema = new mongoose.Schema<TLecture>(
  {
    title: {
      type: String,
    },
    _destroy: {
      type: Boolean,
      default: false,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Lecture = models.Lecture || mongoose.model("Lecture", lectureSchema);
export default Lecture;
