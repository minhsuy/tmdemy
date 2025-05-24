import PageNotFound from "@/app/not-found";
import { IconClock, IconPlay, IconStudy, IconUsers } from "@/components/icons";
import IconAdd from "@/components/icons/IconAdd";
import IconCheck from "@/components/icons/IconCheck";
import { Button } from "@/components/ui/button";
import { courseLevel } from "@/constants";
import { ICourse } from "@/database/course.model";
import { getCourseBySlug } from "@/lib/actions/course.actions";
import { getUserInfo } from "@/lib/actions/user.action";
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

const page = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const { userId } = await auth();
  const user = await getUserInfo({ userId } as any);
  const course = await getCourseBySlug({ slug: params.slug });
  if (!course || !course?.data) return <PageNotFound></PageNotFound>;
  const { data }: { data: ICoursePopulated } = course;
  if (data.status === ECourseStatus.PENDING && user?.role !== EUserRole.ADMIN)
    return <PageNotFound></PageNotFound>;
  const ytb_url = data?.intro_url?.split("v=")[1];
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
        <h1 className="font-bold text-3xl mb-5">{data?.title}</h1>
        <BoxSection title="Mô tả">
          <div className="leading-normal">{data?.description}</div>
        </BoxSection>
        <BoxSection title="Thông tin">
          <div className="grid grid-cols-4 gap-5 mb-10">
            <BoxInfo title="Bài học">100</BoxInfo>
            <BoxInfo title="Lượt xem">{data?.views}</BoxInfo>
            <BoxInfo title="Trình độ">
              {courseLevel?.find((level) => level.value === data?.level)?.title}
            </BoxInfo>
            <BoxInfo title="Thời lượng">100</BoxInfo>
          </div>
        </BoxSection>
        <BoxSection title="Nội dung khóa học">
          <LessonContent data={data}></LessonContent>
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
            <strong className="text-primary text-xl font-bold">
              {data?.price}
            </strong>
            <span className="text-slate-400 line-through text-sm">
              {data?.sale_price}
            </span>
            <span className="ml-auto inline-block px-3 py-1 rounded-lg bg-primary text-primary bg-opacity-10 font-semibold text-sm">
              {Math.floor(
                ((data?.sale_price - data?.price) / data?.sale_price) * 100
              )}
              %
            </span>
          </div>
          <h3 className="font-bold mb-3 text-sm">Khóa học gồm có:</h3>
          <ul className="mb-5 flex flex-col gap-2 text-sm text-slate-700 ">
            <li className="flex items-center gap-2 ">
              <IconClock className="size-4" />
              <span>30h học</span>
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
          <Button className="w-full text-white">Mua khóa học</Button>
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
