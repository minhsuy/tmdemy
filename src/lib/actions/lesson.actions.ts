"use server";

import { ICreateLessonParams, IUpdateLessonParams } from "@/types/type";
import { connectToDatabase } from "../mongoose";
import Course from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import { revalidatePath } from "next/cache";

const createNewLesson = async (params: ICreateLessonParams): Promise<any> => {
  try {
    await connectToDatabase();
    const findCourse = await Course.findById(params.course);
    if (!findCourse) {
      return {
        message: "Khóa học không tồn tại !",
        success: false,
      };
    }
    const findLecture = await Lecture.findById(params.lecture);
    if (!findLecture) {
      return {
        message: "Chương học không tồn tại !",
        success: false,
      };
    }
    const lesson = await Lesson.create(params);
    if (!lesson) {
      return {
        message: "Không thể tạo bài học !",
        data: null,
      };
    }
    findLecture.lessons.push(lesson._id);
    await findLecture.save();
    revalidatePath(params.path || "/");
    return {
      success: true,
      message: "Tạo bài học thành công !",
    };
  } catch (error) {
    console.log(error);
  }
};

const updateLesson = async (params: IUpdateLessonParams): Promise<any> => {
  try {
    await connectToDatabase();
    const findLesson = await Lesson.findById(params._id);
    if (!findLesson) {
      return {
        message: "Bài học không tồn tại !",
        success: false,
      };
    }
    const updateLesson = await Lesson.findByIdAndUpdate(
      params._id,
      params.updatedData,
      { new: true }
    );
    if (!updateLesson) {
      return {
        message: "Không thể updated bài học !",
        success: false,
      };
    }
    revalidatePath(params.updatedData.path || "/");
    return {
      success: true,
      message: "Updated bài học thành công !",
    };
  } catch (error) {
    console.log(error);
  }
};
export { createNewLesson, updateLesson };
