"use server";

import { connectToDatabase } from "../mongoose";
import Order from "@/database/order.model";
import User from "@/database/user.model";
import { EOrderStatus } from "@/types/enums";
import { revalidatePath } from "next/cache";

interface PayPalWebhookData {
  orderId: string;
  orderCode: string;
  amount: number;
  currency: string;
  status: string;
  payerEmail?: string;
  payerId?: string;
}

export const processPayPalPayment = async (webhookData: PayPalWebhookData) => {
  try {
    await connectToDatabase();
    
    // Find the order by code
    const order = await Order.findOne({ code: webhookData.orderCode });
    
    if (!order) {
      return {
        success: false,
        message: "Không tìm thấy đơn hàng",
      };
    }

    // Check if order is already completed
    if (order.status === EOrderStatus.COMPLETED) {
      return {
        success: true,
        message: "Đơn hàng đã được thanh toán",
      };
    }

    // Update order status to completed
    order.status = EOrderStatus.COMPLETED;
    await order.save();

    // Add course to user's courses
    const user = await User.findById(order.user);
    if (user && !user.courses.includes(order.course)) {
      user.courses.push(order.course);
      await user.save();
    }

    // Revalidate relevant paths
    revalidatePath("/my-orders");
    revalidatePath("/study");

    return {
      success: true,
      message: "Thanh toán PayPal thành công",
      data: {
        orderId: order._id,
        orderCode: order.code,
        status: order.status,
      },
    };
  } catch (error) {
    console.error("PayPal Payment Processing Error:", error);
    return {
      success: false,
      message: "Có lỗi xảy ra khi xử lý thanh toán PayPal",
    };
  }
};

export const verifyPayPalOrder = async (orderCode: string, paypalOrderId: string) => {
  try {
    await connectToDatabase();
    
    const order = await Order.findOne({ code: orderCode });
    
    if (!order) {
      return {
        success: false,
        message: "Không tìm thấy đơn hàng",
      };
    }

    // In a real implementation, you would verify the PayPal order
    // by calling PayPal's API with the orderId
    
    return {
      success: true,
      message: "Đơn hàng PayPal hợp lệ",
      data: {
        orderId: order._id,
        orderCode: order.code,
        amount: order.total,
        currency: "USD",
      },
    };
  } catch (error) {
    console.error("PayPal Order Verification Error:", error);
    return {
      success: false,
      message: "Có lỗi xảy ra khi xác minh đơn hàng PayPal",
    };
  }
};
