import { EOrderStatus } from "@/types/enums";
import mongoose, { models, Schema } from "mongoose";

export interface IOrder {
  _id: string;
  code: string;
  amount: number;
  total: number;
  discount: number;
  coupon?: Schema.Types.ObjectId;
  course?: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  status: EOrderStatus;
  paymentId?: string;
  paymentMethod?: string;
}
const orderSchema = new mongoose.Schema<IOrder>(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    amount: {
      type: Number,
      required: false,
    },
    total: {
      type: Number,
      required: false,
    },
    discount: {
      type: Number,
      required: false,
      default: 0,
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      required: false,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(EOrderStatus),
      default: EOrderStatus.PENDING,
    },
    paymentId: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
  },
  { 
    timestamps: true,
    strict: true
  }
);

const Order = models.Order || mongoose.model("Order", orderSchema);
export default Order;
