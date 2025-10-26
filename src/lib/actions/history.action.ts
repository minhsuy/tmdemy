"use server";
import { ICreateHistory } from "@/types/type";
import { connectToDatabase } from "../mongoose";
import { auth } from "@clerk/nextjs/server";
import History from "@/database/history.model";
import Course from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import { revalidatePath } from "next/cache";
import { getUserInfo } from "./user.action";
import { console } from "inspector";

const createHistory = async (params: ICreateHistory) => {
  try {
    await connectToDatabase();
    const { userId } = await auth();
    if (!userId) {
      return;
    }
    const findUser = await getUserInfo({ userId });
    if (!findUser) return;
    if (params.checked) {
      await History.create({
        course: params.course,
        lesson: params.lesson,
        user: findUser._id,
      });
    } else {
      await History.findOneAndDelete({
        course: params.course,
        lesson: params.lesson,
        user: findUser._id,
      });
    }
    revalidatePath(params.path || "/");
  } catch (error) {
    console.log(error);
  }
};
const getHistory = async ({ course }: { course: string }) => {
  try {
    await connectToDatabase();
    const { userId } = await auth();
    if (!userId) {
      return;
    }
    const findUser = await getUserInfo({ userId });
    if (!findUser) return;
    const history = await History.find({
      user: findUser._id,
      course,
    });
    return history;
  } catch (error) {
    console.log(error);
  }
};

const getCourseProgress = async ({ courseId, userId }: { courseId: string; userId: string }) => {
  try {
    await connectToDatabase();
    
    // Lấy thông tin user
    const user = await getUserInfo({ userId });
    if (!user) {
      return {
        success: false,
        message: "User not found"
      };
    }

    // Lấy thông tin khóa học
    const course = await Course.findById(courseId)
      .populate({
        path: "lectures",
        model: Lecture,
        match: { _destroy: false },
        populate: {
          path: "lessons",
          model: Lesson,
          match: { _destroy: false }
        }
      });
    
    if (!course) {
      return {
        success: false,
        message: "Course not found"
      };
    }

    // Lấy tổng số bài học
    const totalLessons = course.lectures.reduce((total, lecture) => {
      return total + (lecture.lessons?.length || 0);
    }, 0);

    // Lấy số bài học đã hoàn thành
    const completedHistory = await History.find({
      user: user._id,
      course: course._id
    });

    const completedLessons = completedHistory.length;
    const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      success: true,
      data: {
        completionPercentage,
        totalLessons,
        completedLessons,
        courseId: course._id.toString(),
        courseTitle: course.title
      }
    };
  } catch (error) {
    console.error("Error getting course progress:", error);
    return {
      success: false,
      message: "Error getting course progress"
    };
  }
};

export { createHistory, getHistory, getCourseProgress };
