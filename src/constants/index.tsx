import {
  IconClock,
  IconComment,
  IconCourse,
  IconExplore,
  IconEye,
  IconOrder,
  IconStar,
  IconStudy,
  IconUsers,
} from "@/components/icons";
import { ICourseInfo, ICourseInfo2, IMenuItems } from "@/types/type";

export const menuItems: IMenuItems[] = [
  {
    id: 1,
    url: "/",
    title: "Khám phá",
    icon: <IconExplore className="size-5"></IconExplore>,
  },
  {
    id: 2,
    url: "/study",
    title: "Khu vực học tập",
    icon: <IconStudy className="size-5"></IconStudy>,
  },
  {
    id: 3,
    url: "/manage/course",
    title: "Quản lý khóa học",
    icon: <IconCourse className="size-5"></IconCourse>,
  },
  {
    id: 4,
    url: "/manage/member",
    title: "Quản lý thành viên",
    icon: <IconUsers className="size-5"></IconUsers>,
  },
  {
    id: 5,
    url: "/manage/comment",
    title: "Quản lý bình luận",
    icon: <IconComment className="size-5"></IconComment>,
  },
  {
    id: 6,
    url: "/manage/order",
    title: "Quản lý đơn hàng",
    icon: <IconOrder className="size-5"></IconOrder>,
  },
];

export const courseInfo = (data: any) => [
  {
    title: data.views,
    icon: (classname: string) => <IconClock className={classname}></IconClock>,
  },
  {
    title: data.rating[0],
    icon: (classname: string) => <IconStar className={classname}></IconStar>,
  },

  {
    title: "1000",
    icon: (classname: string) => <IconEye className={classname}></IconEye>,
  },
];
