"use server";
import {
  ICoursePopulated,
  ICreateCourseParams,
  IUpdateCourse,
} from "@/types/type";
import { connectToDatabase } from "../mongoose";
import { NextResponse } from "next/server";
import Course, { ICourse } from "@/database/course.model";
import { revalidatePath } from "next/cache";
import { ECourseStatus } from "@/types/enums";
import Lecture from "@/database/lecture.model";

const getCourseBySlug = async ({ slug }: { slug: string }): Promise<any> => {
  if (!slug) {
    throw new Error("Slug is required");
  }
  try {
    await connectToDatabase();
    const findCourse = await Course.findOne({ slug }).populate({
      path: "lectures",
      model: Lecture,
      match: { _destroy: false },
    });
    return {
      success: true,
      data: JSON.parse(JSON.stringify(findCourse)),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
    };
  }
};

const getCourses = async (): Promise<any> => {
  try {
    await connectToDatabase();
    const courses = await Course.find();
    return courses;
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
export {
  createCourse,
  getCourseBySlug,
  getCourses,
  updateCourse,
  deleteCourse,
};
