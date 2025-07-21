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
import IconCoupon from "@/components/icons/IconCoupon";
import IconCouponFree from "@/components/icons/IconCouponFree";
import IconMyOrder from "@/components/icons/IconMyOrder";
import {
  ECouponType,
  ECourseLevel,
  ECourseStatus,
  EOrderStatus,
  EUserRole,
} from "@/types/enums";
import { ICourseInfo, IMenuItems, TRatingIcon } from "@/types/type";

export const menuItems: IMenuItems[] = [
  {
    id: 1,
    url: "/",
    title: "Khám phá",
    icon: <IconExplore className="size-5" />,
  },
  {
    id: 2,
    url: "/study",
    title: "Khu vực học tập",
    icon: <IconStudy className="size-5" />,
  },
  {
    id: 3,
    url: "/coupon",
    title: "Săn mã giảm giá",
    icon: <IconCouponFree className="size-5" />,
    roles: EUserRole.USER,
  },
  {
    id: 10,
    url: "/my-orders",
    title: "Đơn hàng của tôi",
    icon: <IconMyOrder className="size-5" />,
    roles: EUserRole.USER,
  },
  {
    id: 4,
    url: "/manage/course",
    title: "Quản lý khóa học",
    icon: <IconCourse className="size-5" />,
    roles: EUserRole.ADMIN,
  },
  {
    id: 5,
    url: "/manage/order",
    title: "Quản lý đơn hàng",
    icon: <IconOrder className="size-5" />,
    roles: EUserRole.ADMIN,
  },
  {
    id: 6,
    url: "/manage/coupon",
    title: "Quản lý coupon",
    icon: <IconCoupon className="size-5" />,
    roles: EUserRole.ADMIN,
  },
  {
    id: 9,
    url: "/manage/rating",
    title: "Quản lý đánh giá",
    icon: <IconStar className="size-5" />,
    roles: EUserRole.ADMIN,
  },
  {
    id: 7,
    url: "/manage/member",
    title: "Quản lý thành viên",
    icon: <IconUsers className="size-5" />,
    roles: EUserRole.ADMIN,
  },
  {
    id: 8,
    url: "/manage/comment",
    title: "Quản lý bình luận",
    icon: <IconComment className="size-5" />,
    roles: EUserRole.ADMIN,
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
    className: "bg-orange-500 text-white",
  },
  {
    title: "Từ chối",
    value: ECourseStatus.REJECTED,
    className: "bg-red-500 text-white",
  },
];
export const orderStatus: {
  title: string;
  value: EOrderStatus;
  className?: string;
}[] = [
  {
    title: "Đã duyệt",
    value: EOrderStatus.COMPLETED,
    className: "bg-green-500 text-white p-2 rounded-md",
  },
  {
    title: "Chờ duyệt",
    value: EOrderStatus.PENDING,
    className: "bg-orange-500 text-white p-2 rounded-md",
  },
  {
    title: "Từ chối",
    value: EOrderStatus.CANCELLED,
    className: "bg-red-500 text-white p-2 rounded-md",
  },
];
export const couponTypes: { value: string; title: string }[] = [
  {
    value: ECouponType.PERCENTAGE,
    title: "Giảm theo phần trăm",
  },
];
export const couponStatus: { value: string; title: string }[] = [
  {
    value: "ACTIVE",
    title: "ACTIVE",
  },
  {
    value: "INACTIVE",
    title: "INACTIVE",
  },
];
export const lessonSaveKey = "lastLesson";

export const ratingList: {
  title: TRatingIcon;
  value: number;
}[] = [
  {
    title: "terrible",
    value: 1,
  },
  {
    title: "bad",
    value: 2,
  },
  {
    title: "meh",
    value: 3,
  },
  {
    title: "good",
    value: 4,
  },
  {
    title: "awesome",
    value: 5,
  },
];
