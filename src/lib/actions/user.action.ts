"use server";
import User from "@/database/user.model";
import { ICreateUser } from "@/types/type";
import { connectToDatabase } from "../mongoose";
import { NextResponse } from "next/server";
import Course from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";

const createUser = async (params: ICreateUser): Promise<any> => {
  if (Object.keys(params).length === 0) {
    throw new Error("User data is required");
  }
  try {
    connectToDatabase();
    const result = await User.create(params);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getUserInfo = async ({ userId }: { userId: string }): Promise<any> => {
  if (!userId) {
    return;
  }
  try {
    connectToDatabase();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({
        message: "User not found",
      });
    }
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong",
      error,
    });
  }
};
const getUserCourses = async ({ userId }: { userId: string }) => {
  if (!userId) {
    return;
  }
  try {
    connectToDatabase();
    const userCourses = await User.findOne({ clerkId: userId }).populate({
      path: "courses",
      model: Course,
      populate: {
        path: "lectures",
        model: Lecture,
        match: { _destroy: false },
        populate: {
          path: "lessons",
          model: Lesson,
          match: { _destroy: false },
        },
      },
    });
    if (!userCourses) {
      return;
    }
    return JSON.parse(JSON.stringify(userCourses));
  } catch (error) {
    console.log(error);
  }
};

export { createUser, getUserInfo, getUserCourses };
