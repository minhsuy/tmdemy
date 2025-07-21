import { ECourseLevel, ECourseStatus } from "@/types/enums";
import mongoose, { models, Schema } from "mongoose";

export interface ICourse extends Document {
  _id: string;
  title: string;
  image: string;
  intro_url: string;
  description: string;
  price: number;
  sale_price: number;
  slug: string;
  status: ECourseStatus;
  author: Schema.Types.ObjectId;
  level: ECourseLevel;
  views: number;
  rating: Schema.Types.ObjectId[];
  createdAt?: string;
  info: {
    requirements: string[];
    benefits: string[];
    qa: {
      question: string;
      answer: string;
    }[];
  };
  lectures: Schema.Types.ObjectId[];
  _destroy: boolean;
}
const courseSchema = new mongoose.Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    intro_url: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    sale_price: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(ECourseStatus),
      default: ECourseStatus.PENDING,
    },
    level: {
      type: String,
      enum: Object.values(ECourseLevel),
      default: ECourseLevel.BEGINNER,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    rating: {
      type: [Schema.Types.ObjectId],
      ref: "Rating",
    },
    views: {
      type: Number,
      default: 0,
    },
    info: {
      requirements: {
        type: [String],
      },
      benefits: {
        type: [String],
      },
      qa: [
        {
          question: {
            type: String,
          },
          answer: {
            type: String,
          },
        },
      ],
    },
    _destroy: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Course = models.Course || mongoose.model("Course", courseSchema);
export default Course;
