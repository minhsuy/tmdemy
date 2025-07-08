"use server";

import Order, { IOrder } from "@/database/order.model";
import { connectToDatabase } from "../mongoose";
import {
  createOrderParams,
  getCourseConditionParams,
  IUpdateOrder,
} from "@/types/type";
import { FilterQuery } from "mongoose";
import User from "@/database/user.model";
import { EOrderStatus } from "@/types/enums";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongoose";
import Coupon from "@/database/coupon.model";

const createNewOrder = async (params: createOrderParams): Promise<any> => {
  try {
    await connectToDatabase();
    const checkExistingOrder = await Order.findOne({
      user: params.user,
      course: params.course,
    });
    if (
      checkExistingOrder &&
      checkExistingOrder.status !== EOrderStatus.CANCELLED
    ) {
      return {
        success: false,
        message: "Bạn đã tạo đơn hàng này rồi !",
        data: JSON.parse(JSON.stringify(checkExistingOrder)),
      };
    }
    if (params.total === 0) {
      const orderData: any = { ...params };
      delete orderData.coupon;
      const user = await User.findById(params.user);
      user.courses.push(params.course);
      const newOrder = await Order.create({
        ...orderData,
        status: EOrderStatus.COMPLETED,
      });
      await user.save();
      return {
        success: true,
        message: "Chúc mừng , bạn đã sở hữu khóa học này rồi !",
        data: JSON.parse(JSON.stringify(newOrder)),
      };
    }
    await Order.findOneAndDelete({
      user: params.user,
      course: params.course,
      status: EOrderStatus.CANCELLED,
    });
    if (params.coupon) {
      const newOrder = await Order.create(params);
      if (newOrder) {
        const coupon = await Coupon.findById(newOrder.coupon);
        if (coupon) {
          coupon.used += 1;
          await coupon.save();
        }
      }
      return {
        success: true,
        message: "Tạo đơn hàng thành công !",
        data: JSON.parse(JSON.stringify(newOrder)),
      };
    }
    const orderData: any = { ...params };
    delete orderData.coupon;

    const newOrder = await Order.create(orderData);
    return {
      success: true,
      message: "Tạo đơn hàng thành công !",
      data: JSON.parse(JSON.stringify(newOrder)),
    };
  } catch (error) {
    console.log(error);
  }
};
const getOrders = async (
  params: getCourseConditionParams
): Promise<IOrder[] | undefined> => {
  try {
    const { search, page = 1, limit = 10, status } = params;
    const query: FilterQuery<typeof Order> = {};
    const skip = (page - 1) * limit;
    if (search) {
      query.$or = [{ code: { $regex: search, $options: "i" } }];
    }
    if (status) {
      query.status = status;
    }
    await connectToDatabase();
    const orders = await Order.find(query)
      .populate({
        path: "course",
        model: "Course",
        select: "title",
      })
      .populate({
        path: "user",
        model: "User",
        select: "name _id",
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.log(error);
  }
};
const getOrderUser = async ({ code }: { code: string }): Promise<any> => {
  try {
    await connectToDatabase();
    const order = await Order.findOne({ code })
      .populate({
        path: "course",
        model: "Course",
        select: "title",
      })
      .populate({
        path: "user",
        model: "User",
        select: "name",
      })
      .populate({
        path: "coupon",
        model: "Coupon",
        select: "code title value",
      });
    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.log(error);
  }
};
const updateOrder = async (params: IUpdateOrder): Promise<any> => {
  try {
    await connectToDatabase();
    if (
      params.status === EOrderStatus.PENDING &&
      params.action === EOrderStatus.COMPLETED
    ) {
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: params._id },
        { status: EOrderStatus.COMPLETED }
      );
      if (updatedOrder) {
        const user = await User.findById(updatedOrder.user);
        user.courses.push(updatedOrder.course);
        await user.save();
        revalidatePath("/manage/order");
        return {
          success: true,
          message: "Đơn hàng đã được duyệt !",
        };
      }
    } else if (
      params.status === EOrderStatus.PENDING &&
      params.action === EOrderStatus.CANCELLED
    ) {
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: params._id },
        { status: EOrderStatus.CANCELLED }
      );
      revalidatePath("/manage/order");
      if (updatedOrder) {
        return {
          success: true,
          message: "Đơn hàng đã được hủy !",
        };
      }
    }
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: params._id },
      { status: EOrderStatus.CANCELLED }
    );
    revalidatePath("/manage/order");

    if (updatedOrder) {
      const user = await User.findById(updatedOrder.user);
      console.log(user, updatedOrder);
      user.courses = user.courses.filter(
        (course: ObjectId) =>
          course.toString() !== updatedOrder.course.toString()
      );
      await user.save();
      revalidatePath("/manage/order");
      return {
        success: true,
        message: "Đơn hàng đã bị hủy!",
      };
    }
  } catch (error) {
    console.log(error);
  }
};
const getMyOrder = async ({ userId }: { userId: string }) => {
  try {
    await connectToDatabase();
    const orders = await Order.find({ user: userId }).populate({
      path: "course",
      model: "Course",
      select: "title",
    });
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.log(error);
  }
};
export { createNewOrder, getOrders, getOrderUser, updateOrder, getMyOrder };
