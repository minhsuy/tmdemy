"use server";

import {
  CouponUpdateParams,
  getCourseConditionParams,
  ICreateCoupon,
} from "@/types/type";
import { connectToDatabase } from "../mongoose";
import Coupon from "@/database/coupon.model";
import { FilterQuery, Query } from "mongoose";
import { revalidatePath } from "next/cache";
import Course from "@/database/course.model";

const createNewCoupon = async (params: ICreateCoupon): Promise<any> => {
  try {
    await connectToDatabase();
    const findCoupon = await Coupon.findOne({ code: params.code });
    if (findCoupon) {
      return {
        success: false,
        message: "Coupon này đã tồn tại !",
        data: null,
      };
    }
    const coupon = await Coupon.create(params);
    revalidatePath("/manage/coupon");
    return {
      success: true,
      message: "Tạo coupon thành công !",
      data: JSON.parse(JSON.stringify(coupon)),
    };
  } catch (error) {
    console.log(error);
  }
};
const getCoupons = async (params: getCourseConditionParams): Promise<any> => {
  try {
    await connectToDatabase();
    const { limit = 10, page = 1, status, search, active } = params;
    const query: FilterQuery<typeof Coupon> = {};
    const skip = (page - 1) * limit;
    if (search) {
      query.$or = [{ code: { $regex: search, $options: "i" } }];
    }
    if (active !== undefined) {
      query.active = active;
    }
    const coupons = await Coupon.find(query)
      .populate({
        path: "courses",
        model: Course,
        select: "slug title",
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(coupons));
  } catch (error) {
    console.log(error);
  }
};
const deleteCoupon = async (code: string, path: string): Promise<any> => {
  try {
    await connectToDatabase();
    await Coupon.findOneAndDelete({ code });
    revalidatePath(path);
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
  }
};
const getCouponByCode = async (code: string): Promise<any> => {
  try {
    await connectToDatabase();
    const coupon = await Coupon.findOne({ code }).populate({
      path: "courses",
      model: Course,
      select: "_id title",
    });
    if (!coupon) return null;
    return JSON.parse(JSON.stringify(coupon));
  } catch (error) {
    console.log(error);
  }
};
const updatedCoupon = async (params: CouponUpdateParams): Promise<any> => {
  try {
    await connectToDatabase();
    const findCoupon = await Coupon.findById(params._id);
    if (!findCoupon)
      return {
        success: false,
        message: "Coupon không tồn tại !",
      };
    const { code } = findCoupon;
    if (code !== params.code) {
      const findCoupon = await Coupon.findOne({ code: params.code });
      if (findCoupon) {
        return {
          success: false,
          message: "Coupon này đã tồn tại !",
        };
      }
    }
    await Coupon.findByIdAndUpdate(params._id, params, {
      new: true,
    });
    revalidatePath("/manage/coupon");
    return {
      success: true,
      message: "Updated coupon thành công !",
    };
  } catch (error) {
    console.log(error);
  }
};
const checkCouponToUse = async ({
  code,
  courseId,
}: {
  code: string;
  courseId: string;
}): Promise<any> => {
  try {
    connectToDatabase();
    const findCoupon = await Coupon.findOne({ code }).populate({
      path: "courses",
      model: Course,
      select: "_id title",
    });
    if (!findCoupon) {
      return {
        success: false,
        message: "Không tìm thấy coupon !",
      };
    }
    const checkIncludeCourse = findCoupon.courses.find((course: any) => {
      return course._id.toString() === courseId;
    });
    if (!checkIncludeCourse) {
      return {
        success: false,
        message: "Không tìm thấy coupon !",
      };
    }
    if (!findCoupon.active) {
      return {
        success: false,
        message: "Coupon chưa hoạt động !",
      };
    }
    if (new Date() < new Date(findCoupon.startDate)) {
      return {
        success: true,
        message: "Coupon chưa hoạt động !",
      };
    }
    if (new Date() > new Date(findCoupon.endDate)) {
      return {
        success: false,
        message: "Coupon đã hết hạn !",
      };
    }
    if (findCoupon.used >= findCoupon.limit) {
      return {
        success: false,
        message: "Coupon đã được dùng hết !",
      };
    }
    return {
      success: true,
      message: "Coupon đã được sử dụng !",
      data: JSON.parse(JSON.stringify(findCoupon)),
    };
  } catch (error) {
    console.log(error);
  }
};
export {
  createNewCoupon,
  getCoupons,
  deleteCoupon,
  getCouponByCode,
  updatedCoupon,
  checkCouponToUse,
};
