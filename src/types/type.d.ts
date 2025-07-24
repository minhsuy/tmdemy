import { ICoupon } from "@/database/coupon.model";
import { ILecture, TLecture } from "./../database/lecture.model";
import { Document } from "mongoose";
import { EOrderStatus, EUserRole, EUserStatus } from "./enums";
import { ICourse } from "@/database/course.model";
import { IComment } from "@/database/comment.model";

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
  roles?: EUserRole;
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
  isDemo?: boolean;
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
export interface TLecturePopulated extends Omit<TLecture, "lessons"> {
  lessons: ICreateLessonParams[];
}
export interface ICreateHistory {
  course: string;
  lesson: string;
  checked: boolean | string;
  path?: string;
}
export interface getCourseConditionParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  active?: boolean;
}
export interface IFilterData {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  active?: boolean;
}
export interface createOrderParams {
  code: string;
  course: string;
  user: string;
  total?: number;
  amount?: number;
  discount?: number;
  coupon?: string;
}
export interface IOrderManage {
  _id: string;
  code?: string;
  amount?: number;
  discount?: number;
  total?: number;
  status: EOrderStatus;
  course: {
    title: string;
  };
  user: {
    name: string;
    _id: string;
  };
  coupon: {
    title: string;
    code: string;
    value: number;
  };
}
export interface IUpdateOrder {
  status: EOrderStatus;
  _id: string;
  action: EOrderStatus.COMPLETED | EOrderStatus.CANCELLED;
  user_id?: string;
}
export interface ICreateCoupon {
  title?: string;
  code: string;
  active?: boolean;
  limit?: number;
  type?: string;
  value?: number;
  courses?: string[];
}
export interface ICouponPopulated extends Omit<ICoupon, "courses"> {
  courses: {
    _id: string;
    title: string;
  }[];
}
export interface CouponUpdateParams {
  title?: string;
  code?: string;
  active?: boolean;
  limit?: number;
  type?: string;
  value?: number;
  courses?: string[];
  _id: string;
}
export interface ICourseDetail {
  duration: number;
  length: number;
  success: boolean;
}
export interface ICreateRating {
  success: boolean;
  message: string;
}
export interface ICreateRatingParams {
  course: string;
  rate: number;
  content: string;
  user: string;
}
export interface IRatingItem {
  _id: string;
  rate: number;
  content: string;
  status: ERatingStatus;
  course: {
    title: string;
    slug: string;
  };
  user: {
    username: string;
  };
  createdAt: string;
}
export interface ICreateComment {
  user?: string;
  lesson?: string;
  course?: string;
  content?: string;
  path?: string;
  slug?: string;
}
export interface ICommentItem extends Omit<IComment, "user"> {
  user: {
    username: string;
    avatar: string;
    _id: string;
  };
}
export type TRatingIcon = "awesome" | "good" | "meh" | "bad" | "terrible";
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
