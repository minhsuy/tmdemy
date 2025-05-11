"use server";

import { ICreateCourseParams, IUpdateCourse } from "@/types/type";
import { connectToDatabase } from "../mongoose";
import { NextResponse } from "next/server";
import Course, { ICourse } from "@/database/course.model";
import { revalidatePath } from "next/cache";

const getCourseBySlug = async ({ slug }: { slug: string }): Promise<any> => {
  if (!slug) {
    throw new Error("Slug is required");
  }
  try {
    connectToDatabase();
    const findCourse = await Course.findOne({ slug });
    return {
      success: true,
      data: JSON.parse(JSON.stringify(findCourse)),
    };
  } catch (error) {
    console.log(error);
  }
};

const getCourses = async (): Promise<any> => {
  try {
    connectToDatabase();
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
    connectToDatabase();
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
    throw new Error("Slug is required");
  }
  try {
    connectToDatabase();
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
export { createCourse, getCourseBySlug, getCourses, updateCourse };
