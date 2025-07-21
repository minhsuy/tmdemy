import PageNotFound from "@/app/not-found";

import {
  IconClock,
  IconPlay,
  IconStar,
  IconStudy,
  IconUsers,
} from "@/components/icons";

import IconAdd from "@/components/icons/IconAdd";
import IconCheck from "@/components/icons/IconCheck";
import { Button } from "@/components/ui/button";
import { courseLevel } from "@/constants";
import { ICourse } from "@/database/course.model";
import {
  getCourseBySlug,
  getDurationAndLengthOfCourse,
  viewsCourse,
} from "@/lib/actions/course.actions";
import { getUserCourses, getUserInfo } from "@/lib/actions/user.action";
import { ECourseStatus, EUserRole } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import { ICoursePopulated, ICreateLessonParams } from "@/types/type";
import LessonItem from "@/components/lesson/LessonItem";
import LessonContent from "@/components/lesson/LessonContent";
import { formatMoney } from "@/utils";
import Link from "next/link";
import LinkToErrolCourse from "./LinkToErrolCourse";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatTime } from "@/lib/utils";
const page = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const { userId } = await auth();
  const user = await getUserCourses({ userId } as any);
  const course = await getCourseBySlug({ slug: params.slug });
  if (!course || !course?.data) return <PageNotFound></PageNotFound>;
  await viewsCourse(params.slug);
  const { data }: { data: ICoursePopulated } = course;
  const courseDetail = await getDurationAndLengthOfCourse(data?.slug);

  if (data.status === ECourseStatus.PENDING && user?.role !== EUserRole.ADMIN)
    return <PageNotFound></PageNotFound>;
  const ytb_url = data?.intro_url?.split("v=")[1];
  const includesCourses = user?.courses?.some(
    (courseId: any) => courseId._id.toString() === data._id.toString()
  );
  const ratings = data?.rating?.map((item: any) => ({
    content: item.content,
    avatar: item.user.avatar,
    rate: item.rate,
    username: item.user.username,
  }));
  return (
    <div className="grid lg:grid-cols-[2fr,1fr] gap-10 min-h-screen mb-12">
      <div>
        <div className="relative aspect-video mb-5">
          {data?.intro_url ? (
            <iframe
              width="976"
              height="549"
              src={`https://www.youtube.com/embed/${ytb_url}`}
              title={data?.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              className="w-full h-full object-cover rounded-lg"
            ></iframe>
          ) : (
            <Image
              src={
                data?.image ||
                "https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt=""
              fill
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
        {ratings.length > 0 && (
          <div>
            <h2 className="font-bold text-xl mb-5">Đánh giá khóa học</h2>
            <div className="flex flex-wrap gap-2 mb-5">
              {ratings.map((rating, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button className="border border-gray-300 bg-white hover:bg-gray-50 rounded-full">
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 font-medium"
                      >
                        <Image
                          src={rating.avatar || "/rating/awesome.png"}
                          alt="Avatar"
                          width={24}
                          height={24}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1 text-yellow-500 text-xs">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <IconStar
                                key={i}
                                className={`size-3  fill-current ${
                                  i < rating.rate
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-800 line-clamp-2 max-w-[200px] text-xs">
                            {rating.content}
                          </span>
                        </div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-white">
                    <p>{`${rating.username} - ${rating.content}`}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
        <h1 className="font-bold text-3xl mb-5">{data?.title}</h1>
        <BoxSection title="Mô tả">
          <div className="leading-normal">{data?.description}</div>
        </BoxSection>
        <BoxSection title="Thông tin">
          <div className="grid grid-cols-4 gap-5 mb-10">
            <BoxInfo title="Bài học">{courseDetail?.length}</BoxInfo>
            <BoxInfo title="Lượt xem">{data?.views}</BoxInfo>
            <BoxInfo title="Trình độ">
              {courseLevel?.find((level) => level.value === data?.level)?.title}
            </BoxInfo>
            <BoxInfo title="Thời lượng">
              {formatTime(courseDetail?.duration || 0)}
            </BoxInfo>
          </div>
        </BoxSection>
        <BoxSection title="Nội dung khóa học">
          <LessonContent data={data} courseSlug={params.slug}></LessonContent>
        </BoxSection>
        <BoxSection title="Yêu cầu">
          {data &&
            data.info.requirements.map((r, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <IconCheck className="size-5 p-1 bg-primary text-white rounded-sm"></IconCheck>
                <span>{r}</span>
              </div>
            ))}
        </BoxSection>
        <BoxSection title="Lợi ích">
          {data &&
            data.info.benefits.map((r, index: any) => (
              <div key={index} className="flex items-center gap-2">
                <IconAdd className="size-5 p-1 bg-primary text-white rounded-sm"></IconAdd>
                <span>{r}</span>
              </div>
            ))}
        </BoxSection>
        <BoxSection title="Q.A">
          {data.info.qa.map((qa, index) => (
            <Accordion type="single" collapsible key={index}>
              <AccordionItem value={qa.question}>
                <AccordionTrigger>{qa.question}</AccordionTrigger>
                <AccordionContent>{qa.answer}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </BoxSection>
      </div>
      <div>
        <div className="bg-white rounded-lg p-5 ">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-primary text-xl font-bold">
              {data?.price === 0 ? (
                "Miễn phí"
              ) : (
                <strong>{formatMoney(data?.price)} đ</strong>
              )}
            </div>
            <span className="text-slate-400 line-through text-sm">
              {data?.price > 0 && formatMoney(data?.sale_price)}
            </span>
            <span className="ml-auto inline-block px-3 py-1 rounded-lg bg-primary text-primary bg-opacity-10 font-semibold text-sm">
              {data?.price > 0 &&
                Math.floor(
                  (((data?.sale_price - data?.price) / data?.sale_price) *
                    100) |
                    0
                ) + "%"}
            </span>
          </div>
          <h3 className="font-bold mb-3 text-sm">Khóa học gồm có:</h3>
          <ul className="mb-5 flex flex-col gap-2 text-sm text-slate-700 ">
            <li className="flex items-center gap-2 ">
              <IconClock className="size-4" />
              <span>{formatTime(courseDetail?.duration || 0)} giờ học</span>
            </li>
            <li className="flex items-center gap-2">
              <IconPlay className="size-4" />
              <span>Video Full HD</span>
            </li>
            <li className="flex items-center gap-2">
              <IconUsers className="size-4" />
              <span>Có nhóm hỗ trợ</span>
            </li>
            <li className="flex items-center gap-2">
              <IconStudy className="size-4" />
              <span>Tài liệu kèm theo</span>
            </li>
          </ul>
          {(includesCourses || user?.role === EUserRole.ADMIN) && (
            <Link
              href={`/${data?.slug}/lesson?slug=${
                (data?.lectures[0]?.lessons[0] as any)?.slug
              }`}
              className="flex items-center justify-center w-full mt-10 rounded-lg text-white font-semibold bg-primary h-10"
            >
              Tiếp tục học
            </Link>
          )}
          {!includesCourses && user?.role !== EUserRole.ADMIN && (
            <LinkToErrolCourse
              user={user}
              courseId={data?._id.toString()}
              price={data?.price}
            ></LinkToErrolCourse>
          )}
        </div>
      </div>
    </div>
  );
};
function BoxInfo({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg p-5 dark:text-black">
      <h4 className="text-sm text-slate-700 font-normal">{title}</h4>
      <h3 className="font-bold">{children}</h3>
    </div>
  );
}

function BoxSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h2 className="font-bold text-xl mb-5">{title}</h2>
      <div className="mb-10">{children}</div>
    </>
  );
}
export default page;
