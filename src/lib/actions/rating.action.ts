"use server";

import Rating from "@/database/rating.model";
import { connectToDatabase } from "../mongoose";
import {
  ICreateRating,
  ICreateRatingParams,
  IFilterData,
  IRatingItem,
} from "@/types/type";
import Course from "@/database/course.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { ERatingStatus } from "@/types/enums";
import { FilterQuery } from "mongoose";

const createNewRating = async (
  params: ICreateRatingParams
): Promise<ICreateRating | undefined> => {
  try {
    connectToDatabase();
    const checkExistingRating = await Rating.findOne({
      course: params.course,
      user: params.user,
    });
    if (checkExistingRating) {
      return {
        success: false,
        message: "Bạn đã đánh giá khóa học này rồi !",
      };
    } else {
      const rating = await Rating.create(params);
      if (!rating) {
        return {
          success: false,
          message: "Không thể đánh giá khóa học !",
        };
      }
      const findCourse = await Course.findById(params.course);
      if (!findCourse) {
        return {
          success: false,
          message: "Khóa học không tồn tại !",
        };
      }
      findCourse.rating.push(rating._id);
      await findCourse.save();
      return {
        success: true,
        message: "Đánh giá thành công !",
      };
    }
  } catch (error) {
    console.log(error);
  }
};

const getRatings = async (
  params: IFilterData
): Promise<IRatingItem[] | undefined> => {
  try {
    connectToDatabase();
    const query: FilterQuery<typeof Rating> = {};
    const { page = 1, search, status, limit = 10 } = params;
    const skip = (page - 1) * limit;
    if (search) {
      query.$or = [{ content: { $regex: search, $options: "i" } }];
    }
    if (status) {
      query.status = status;
    }
    const ratings = await Rating.find(query)
      .populate({
        path: "user",
        model: User,
        select: "username",
      })
      .populate({
        path: "course",
        model: Course,
        select: "title slug",
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(ratings));
  } catch (error) {
    console.log(error);
  }
};
const deleteRating = async ({
  id,
}: {
  id: string;
}): Promise<ICreateRating | undefined> => {
  try {
    connectToDatabase();
    const findRating = await Rating.findById(id);
    if (!findRating) {
      return {
        success: false,
        message: "Không tìm thấy đánh giá !",
      };
    }
    const findCourse = await Course.findById(findRating.course);
    if (!findCourse) {
      return {
        success: false,
        message: "Khóa học không tồn tại !",
      };
    }
    findCourse.rating = findCourse.rating.filter(
      (rating: string) => rating.toString() !== id
    );
    await findCourse.save();
    await Rating.findByIdAndDelete(id);
    revalidatePath("/manage/rating");
    return {
      success: true,
      message: "Xóa đánh giá thành công !",
    };
  } catch (error) {
    console.log(error);
  }
};
const updateRatingStatus = async ({
  id,
}: {
  id: string;
}): Promise<ICreateRating | undefined> => {
  try {
    connectToDatabase();
    const findRating = await Rating.findById(id);
    if (!findRating) {
      return {
        success: false,
        message: "Không tìm thấy đánh giá !",
      };
    }
    findRating.status =
      findRating.status === ERatingStatus.ACTIVE
        ? ERatingStatus.INACTIVE
        : ERatingStatus.ACTIVE;
    await findRating.save();
    revalidatePath("/manage/rating");
    return {
      success: true,
      message: "Cập nhật trạng thái thành công !",
    };
  } catch (error) {
    console.log(error);
  }
};
export { createNewRating, getRatings, deleteRating, updateRatingStatus };
