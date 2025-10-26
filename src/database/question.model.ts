import { EQuestionType } from "@/types/enums";
import mongoose, { models, Schema } from "mongoose";

export interface IQuestion extends Document {
  _id: string;
  question: string;
  type: EQuestionType;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
  points: number;
  order: number;
  quiz: Schema.Types.ObjectId;
  _destroy: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const questionSchema = new mongoose.Schema<IQuestion>(
  {
    question: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(EQuestionType),
      default: EQuestionType.MULTIPLE_CHOICE,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswer: {
      type: Number,
      required: true,
    },
    explanation: {
      type: String,
      default: "",
    },
    points: {
      type: Number,
      default: 1,
    },
    order: {
      type: Number,
      default: 0,
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    _destroy: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Question = models.Question || mongoose.model("Question", questionSchema);
export default Question;
