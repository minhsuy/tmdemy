import mongoose, { Document, Schema } from "mongoose";

export interface ICodeExercise extends Document {
  title: string;
  description: string;
  instructions: string;
  starterCode: string;
  solution: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    description: string;
  }>;
  language: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  timeLimit: number; // in minutes
  maxAttempts: number;
  points: number;
  course: mongoose.Types.ObjectId;
  lesson: mongoose.Types.ObjectId;
  order: number;
  status: "ACTIVE" | "INACTIVE";
  _destroy: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CodeExerciseSchema = new Schema<ICodeExercise>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    instructions: {
      type: String,
      required: true,
      trim: true,
    },
    starterCode: {
      type: String,
      required: true,
      default: "",
    },
    solution: {
      type: String,
      required: true,
    },
    testCases: [
      {
        input: {
          type: String,
          required: true,
        },
        expectedOutput: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    language: {
      type: String,
      required: true,
      enum: ["javascript", "python", "java", "cpp", "csharp", "php", "ruby", "go"],
      default: "javascript",
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["EASY", "MEDIUM", "HARD"],
      default: "EASY",
    },
    timeLimit: {
      type: Number,
      required: true,
      default: 30, // 30 minutes
    },
    maxAttempts: {
      type: Number,
      required: true,
      default: 3,
    },
    points: {
      type: Number,
      required: true,
      default: 10,
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
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    _destroy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CodeExerciseSchema.index({ course: 1, lesson: 1, order: 1 });
CodeExerciseSchema.index({ _destroy: 1 });
CodeExerciseSchema.index({ status: 1 });

const CodeExercise = mongoose.models.CodeExercise || mongoose.model<ICodeExercise>("CodeExercise", CodeExerciseSchema);

export default CodeExercise;
