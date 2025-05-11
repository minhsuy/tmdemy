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

export {
  IActiveLink,
  IMenuItem,
  IMenuItems,
  ICourseInfo,
  IUser,
  ICreateUser,
  ICreateCourseParams,
  IUpdateCourse,
};
