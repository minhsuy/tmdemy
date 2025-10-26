import mongoose, { models, Schema } from "mongoose";

export interface IQuizResult extends Document {
  _id: string;
  user: Schema.Types.ObjectId;
  quiz: Schema.Types.ObjectId;
  answers: {
    questionId: Schema.Types.ObjectId;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
  score: number;
  percentage: number;
  passed: boolean;
  timeSpent: number; // in seconds
  attemptNumber: number;
  completedAt: Date;
  createdAt?: string;
  updatedAt?: string;
}

const quizResultSchema = new mongoose.Schema<IQuizResult>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedAnswer: {
          type: Number,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    timeSpent: {
      type: Number,
      required: true,
    },
    attemptNumber: {
      type: Number,
      required: true,
    },
    completedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const QuizResult = models.QuizResult || mongoose.model("QuizResult", quizResultSchema);
export default QuizResult;
