import { EQuizStatus } from "@/types/enums";
import mongoose, { models, Schema } from "mongoose";

export interface IQuiz extends Document {
  _id: string;
  title: string;
  description: string;
  course: Schema.Types.ObjectId;
  lesson: Schema.Types.ObjectId;
  timeLimit: number; // in minutes
  maxAttempts: number;
  passingScore: number; // percentage
  status: EQuizStatus;
  questions: Schema.Types.ObjectId[];
  _destroy: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const quizSchema = new mongoose.Schema<IQuiz>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    timeLimit: {
      type: Number,
      default: 30, // 30 minutes default
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    passingScore: {
      type: Number,
      default: 70, // 70% default
    },
    status: {
      type: String,
      enum: Object.values(EQuizStatus),
      default: EQuizStatus.ACTIVE,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    _destroy: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Quiz = models.Quiz || mongoose.model("Quiz", quizSchema);
export default Quiz;
