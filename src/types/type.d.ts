import { ILecture, TLecture } from "./../database/lecture.model";
import { Document } from "mongoose";
import { EUserRole, EUserStatus } from "./enums";
import { ICourse } from "@/database/course.model";

interface IActiveLink {
  url: string;
  children: React.ReactNode;
}
interface IMenuItem {
  icon?: React.ReactNode;
  url: string;
  title: string;
  onlyIcon?: boolean;
}
interface IMenuItems {
  id: number;
  url: string;
  title: string;
  icon?: React.ReactNode;
}
interface ICourseInfo {
  title: string | number;
  icon: (classname: string) => React.ReactNode;
}

interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  courses: mongoose.Types.ObjectId[];
  role: EUserRole;
  status: EUserStatus;
}
interface ICreateUser {
  clerkId: string;
  name?: string;
  username: string;
  email: string;
  avatar?: string;
}

interface ICreateCourseParams {
  title: string;
  slug: string;
}
interface IUpdateCourse {
  slug: string;
  updateData: Partial<ICourse>;
}
interface ICreateLectureParams {
  path?: string;
  title?: string;
  course: string;
  order?: number;
}
interface IUpdateLectureParams {
  _id: string;
  updatedData: {
    path?: string;
    title?: string;
    order?: number;
    _destroy?: boolean;
  };
}
interface ILecture {
  path?: string;
  title?: string;
  course: string;
  order?: number;
  _destroy?: boolean;
}
export interface ICoursePopulated extends Omit<ICourse, "lectures"> {
  lectures: TLecture[];
}
// export interface ICourseWithLesson extends Omit<ICourse, "lectures"> {
//   lectures: TLecture[];
// }
interface ICreateLessonParams {
  course: string;
  lecture: string;
  title?: string;
  slug?: string;
  content?: string;
  video_url?: string;
  order?: number;
  duration?: number;
  content?: string;
  _destroy?: boolean;
  path?: string;
  _id?: string;
}
interface IUpdateLessonParams {
  _id: string;
  updatedData: {
    title?: string;
    slug?: string;
    video_url?: string;
    order?: number;
    duration?: number;
    content?: string;
    _destroy?: boolean;
    path?: string;
  };
}
export {
  IActiveLink,
  IMenuItem,
  IMenuItems,
  ICourseInfo,
  IUser,
  ICreateUser,
  ICreateCourseParams,
  IUpdateCourse,
  ICreateLectureParams,
  IUpdateLectureParams,
  ILecture,
  ICoursePopulated,
  ICreateLessonParams,
  IUpdateLessonParams,
};
