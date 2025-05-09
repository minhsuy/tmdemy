"use server";

import { ICreateCourseParams } from "@/types/type";
import { connectToDatabase } from "../mongoose";
import { NextResponse } from "next/server";
import Course from "@/database/course.model";

const getCourseBySlug = async (slug: string) => {
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

const createCourse = async (params: ICreateCourseParams): Promise<any> => {
  if (Object.keys(params).length === 0) {
    throw new Error("Course data is required");
  }
  try {
    connectToDatabase();
    const course = await Course.create(params);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(course)),
    };
  } catch (error) {
    console.log(error);
  }
};

export { createCourse };
