"use server";
import {
  getCourseConditionParams,
  ICourseDetail,
  ICoursePopulated,
  ICreateCourseParams,
  IUpdateCourse,
} from "@/types/type";
import { connectToDatabase } from "../mongoose";
import { NextResponse } from "next/server";
import Course, { ICourse } from "@/database/course.model";
import { revalidatePath } from "next/cache";
import { ECourseStatus, ERatingStatus } from "@/types/enums";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import { FilterQuery } from "mongoose";
import Rating from "@/database/rating.model";
import User from "@/database/user.model";

const getCourseBySlug = async ({ slug }: { slug: string }): Promise<any> => {
  if (!slug) {
    throw new Error("Slug is required");
  }
  try {
    await connectToDatabase();
    const findCourse = await Course.findOne({ slug })
      .populate({
        path: "lectures",
        model: Lecture,
        match: { _destroy: false },
        populate: {
          path: "lessons",
          model: Lesson,
          match: { _destroy: false },
        },
      })
      .populate({
        path: "rating",
        model: Rating,
        match: { status: ERatingStatus.ACTIVE },
        select: "rate content user",
        populate: {
          path: "user",
          model: User,
          select: "avatar username",
        },
      });
    return {
      success: true,
      data: JSON.parse(JSON.stringify(findCourse)),
    };
  } catch (error) {
    console.log(error);
  }
};

const getCourses = async (params: getCourseConditionParams): Promise<any> => {
  if (!params) {
    params = {};
  }
  const { search, page = 1, limit = 10, status } = params;
  const query: FilterQuery<typeof Course> = {};
  const skip = (page - 1) * limit;
  if (search) {
    query.$or = [{ title: { $regex: search, $options: "i" } }];
  }
  if (status) {
    query.status = status;
  }
  try {
    await connectToDatabase();
    const courses = await Course.find(query)
      .populate({
        path: "lectures",
        model: Lecture,
        populate: {
          path: "lessons",
          model: Lesson,
        },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.log(error);
  }
};

const createCourse = async (params: ICreateCourseParams): Promise<any> => {
  if (Object.keys(params).length === 0) {
    throw new Error("Course data is required");
  }
  try {
    await connectToDatabase();
    const checkExistCourse = await Course.findOne({ slug: params.slug });
    if (checkExistCourse) {
      return {
        success: false,
        message:
          "Khóa học đã tồn tại , vui lòng tạo 1 khóa học khác hoặc đổi đường dẫn !",
      };
    }
    const course = await Course.create(params);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(course)),
    };
  } catch (error) {
    console.log(error);
  }
};

const updateCourse = async (params: IUpdateCourse): Promise<any> => {
  if (!params.slug) {
    return {
      success: false,
      message: "Khóa học không tồn tại !",
    };
  }
  try {
    await connectToDatabase();
    const checkCourseExisting = await Course.findOne({ slug: params.slug });
    if (!checkCourseExisting) {
      return {
        success: false,
        message: "Khóa học không tồn tại !",
      };
    }
    const updatedCourse = await Course.findOneAndUpdate(
      { slug: params.slug },
      params.updateData,
      { new: true }
    );
    if (!updatedCourse) {
      return {
        success: false,
        message: "Không thể updated khóa học !",
      };
    }
    revalidatePath("/");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedCourse)),
    };
  } catch (error) {
    console.log(error);
  }
};
const deleteCourse = async (slug: string, pathname: string): Promise<any> => {
  try {
    await connectToDatabase();
    if (!slug) {
      throw new Error("Slug is required");
    }
    const checkCourseExisting = await Course.findOne({ slug: slug });
    if (!checkCourseExisting) {
      return {
        success: false,
        message: "Khóa học không tồn tại !",
      };
    }
    if (checkCourseExisting._destroy) {
      return {
        success: true,
        deleted: false,
        message: "Khóa học được xóa  , bạn có muốn khôi phục lại nó không !",
      };
    }
    const deletedCourse = await Course.findOneAndUpdate(
      { slug: slug },
      { _destroy: true, status: ECourseStatus.PENDING },
      { new: true }
    );
    if (!deletedCourse) {
      return {
        success: false,
        message: "Không thể xóa khóa học !",
      };
    }
    revalidatePath(pathname || "/");
    return {
      success: true,
      message: "Xóa khóa học thành công !",
    };
  } catch (error) {
    console.log(error);
  }
};
const viewsCourse = async (slug: string): Promise<any> => {
  try {
    await connectToDatabase();
    const course = await Course.findOne({ slug: slug });
    if (!course) {
      return {
        success: false,
        message: "Khóa học không tồn tại !",
      };
    }
    await Course.findOneAndUpdate({ slug: slug }, { $inc: { views: 1 } });
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
  }
};
const getDurationAndLengthOfCourse = async (
  slug: string
): Promise<ICourseDetail | undefined> => {
  try {
    await connectToDatabase();
    const course = await Course.findOne({ slug }).populate({
      path: "lectures",
      model: Lecture,
      match: { _destroy: false },
      populate: {
        path: "lessons",
        model: Lesson,
        match: { _destroy: false },
      },
    });
    if (!course) {
      return {
        success: false,
        duration: 0,
        length: 0,
      };
    }
    const lecture = course.lectures.map((l: any) => l.lessons).flat();
    const duration = lecture.reduce(
      (acc: number, cur: any) => acc + cur.duration,
      0
    );

    return {
      success: true,
      duration,
      length: lecture.length,
    };
  } catch (error) {
    console.log(error);
  }
};
export {
  createCourse,
  getCourseBySlug,
  getCourses,
  updateCourse,
  deleteCourse,
  viewsCourse,
  getDurationAndLengthOfCourse,
};
