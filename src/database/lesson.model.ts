import { ECourseLevel, ECourseStatus, ELessonType } from "@/types/enums";
import mongoose, { models, Schema } from "mongoose";

export interface ILesson extends Document {
  _id: string;
  title: string;
  slug: string;
  lecture: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  order: number;
  duration: number;
  video_url: string;
  content: string;
  type: ELessonType;
  _destroy: boolean;
}

const lessonSchema = new mongoose.Schema<ILesson>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
    },
    video_url: {
      type: String,
    },
    _destroy: {
      type: Boolean,
      default: false,
    },
    lecture: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    type: {
      type: String,
      enum: Object.values(ELessonType),
      default: ELessonType.VIDEO,
    },
  },
  { timestamps: true }
);

const Lesson = models.Lesson || mongoose.model("Lesson", lessonSchema);
export default Lesson;
