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
  rating: number[];
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
    },
    intro_url: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    sale_price: {
      type: Number,
    },
    status: {
      type: String,
      enum: Object.values(ECourseStatus),
      default: ECourseStatus.PENDING,
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
      type: [Number],
      default: [5],
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
