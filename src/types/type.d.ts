import { Document } from "mongoose";
import { EUserRole, EUserStatus } from "./enums";

interface IActiveLink {
  url: string;
  children: React.ReactNode;
}
interface IMenuItem {
  icon?: React.ReactNode;
  url: string;
  title: string;
}
interface ICourseInfo {
  title: string | number;
  icon: (classname: string) => React.ReactNode;
}

interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email_address: string;
  avatar: string;
  course: mongoose.Types.ObjectId[];
  role: EUserRole;
  status: EUserStatus;
}
interface ICreateUser {
  clerkId: string;
  name?: string;
  username: string;
  email_address: string;
  avatar?: string;
}
export { IActiveLink, IMenuItem, IMenuItems, ICourseInfo, IUser, ICreateUser };
