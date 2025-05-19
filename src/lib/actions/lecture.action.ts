"use server";

import { ICreateLectureParams, IUpdateLectureParams } from "@/types/type";
import { connectToDatabase } from "../mongoose";
import Course from "@/database/course.model";
import { revalidatePath } from "next/cache";
import Lecture from "@/database/lecture.model";

const createNewLecture = async (params: ICreateLectureParams) => {
  try {
    connectToDatabase();
    const findCourse = await Course.findById(params.course);
    if (!findCourse) {
      return {
        success: false,
        message: "Khóa học không tồn tại !",
      };
    }
    const lecture = await Lecture.create(params);
    if (!lecture) {
      return {
        success: false,
        message: "Không thể tạo chương học !",
      };
    }
    findCourse.lectures.push(lecture._id);
    await findCourse.save();
    revalidatePath(params.path || "/");
    return {
      success: true,
      message: "Taạo chương học thành công !",
      data: JSON.parse(JSON.stringify(lecture)),
    };
  } catch (error) {
    console.log(error);
  }
};
const updateLecture = async (params: IUpdateLectureParams) => {
  try {
    connectToDatabase();
    const findLecture = await Lecture.findById(params._id);
    if (!findLecture) {
      return {
        success: false,
        message: "Chương học không tồn tại !",
      };
    }
    const updatedLecture = await Lecture.findByIdAndUpdate(
      params._id,
      params.updatedData,
      { new: true }
    );
    if (!updatedLecture) {
      return {
        success: false,
        message: "Không thể updated chương học !",
      };
    }
    revalidatePath(params.updatedData.path || "/");
    return {
      success: true,
      message: "Updated chương học thành công !",
    };
  } catch (error) {
    console.log(error);
  }
};
export { createNewLecture, updateLecture };
