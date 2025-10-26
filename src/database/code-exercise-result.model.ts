import mongoose, { Document, Schema } from "mongoose";

export interface ICodeExerciseResult extends Document {
  codeExercise: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  code: string;
  language: string;
  testResults: Array<{
    testCase: number;
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    error?: string;
  }>;
  score: number;
  totalTests: number;
  passedTests: number;
  executionTime: number; // in milliseconds
  attempts: number;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CodeExerciseResultSchema = new Schema<ICodeExerciseResult>(
  {
    codeExercise: {
      type: Schema.Types.ObjectId,
      ref: "CodeExercise",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    testResults: [
      {
        testCase: {
          type: Number,
          required: true,
        },
        passed: {
          type: Boolean,
          required: true,
        },
        input: {
          type: String,
          required: true,
        },
        expectedOutput: {
          type: String,
          required: true,
        },
        actualOutput: {
          type: String,
          required: true,
        },
        error: {
          type: String,
        },
      },
    ],
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    totalTests: {
      type: Number,
      required: true,
      default: 0,
    },
    passedTests: {
      type: Number,
      required: true,
      default: 0,
    },
    executionTime: {
      type: Number,
      required: true,
      default: 0,
    },
    attempts: {
      type: Number,
      required: true,
      default: 1,
    },
    completedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CodeExerciseResultSchema.index({ codeExercise: 1, user: 1 });
CodeExerciseResultSchema.index({ user: 1, completedAt: -1 });

const CodeExerciseResult = mongoose.models.CodeExerciseResult || mongoose.model<ICodeExerciseResult>("CodeExerciseResult", CodeExerciseResultSchema);

export default CodeExerciseResult;
