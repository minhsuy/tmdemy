"use server";

import Order, { IOrder } from "@/database/order.model";
import { connectToDatabase } from "../mongoose";
import { createOrderParams, getCourseConditionParams } from "@/types/type";
import { FilterQuery } from "mongoose";
import User from "@/database/user.model";
import { EOrderStatus } from "@/types/enums";

const createNewOrder = async (params: createOrderParams): Promise<any> => {
  try {
    await connectToDatabase();
    const checkExistingOrder = await Order.findOne({
      user: params.user,
      course: params.course,
    });
    if (checkExistingOrder) {
      return {
        success: false,
        message: "Bạn đã tạo đơn hàng này rồi !",
        data: JSON.parse(JSON.stringify(checkExistingOrder)),
      };
    }
    if (params.total === 0) {
      const user = await User.findById(params.user);
      user.courses.push(params.course);
      const newOrder = await Order.create({
        ...params,
        status: EOrderStatus.COMPLETED,
      });
      await user.save();
      return {
        success: true,
        message: "Chúc mừng , bạn đã sở hữu khóa học này rồi !",
        data: JSON.parse(JSON.stringify(newOrder)),
      };
    }
    const newOrder = await Order.create(params);
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
        select: "name",
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
      });
    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.log(error);
  }
};
export { createNewOrder, getOrders, getOrderUser };
