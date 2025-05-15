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
import { ECourseLevel, ECourseStatus } from "@/types/enums";
import { ICourseInfo, IMenuItems } from "@/types/type";

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

export const courseLevel: {
  title: string;
  value: ECourseLevel;
}[] = [
  {
    title: "Dễ",
    value: ECourseLevel.BEGINNER,
  },
  {
    title: "Trung bình",
    value: ECourseLevel.INTERMEDIATE,
  },
  {
    title: "Khó",
    value: ECourseLevel.ADVANCED,
  },
];

export const courseStatus: {
  title: string;
  value: ECourseStatus;
  className?: string;
}[] = [
  {
    title: "Đã duyệt",
    value: ECourseStatus.ACTIVE,
    className: "bg-green-500 text-white",
  },
  {
    title: "Chờ duyệt",
    value: ECourseStatus.PENDING,
    className: "bg-yellow-500 text-white",
  },
  {
    title: "Từ chối",
    value: ECourseStatus.REJECTED,
    className: "bg-red-500 text-white",
  },
];
