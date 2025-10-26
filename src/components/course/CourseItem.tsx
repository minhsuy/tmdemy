"use client";
import { ICourse } from "@/database/course.model";
import Image from "next/image";
import Link from "next/link";
import { IconClock, IconEye, IconStar } from "@/components/icons";
import { formatMoney } from "@/utils";
import { getDurationAndLengthOfCourse } from "@/lib/actions/course.actions";
import { formatTime } from "@/lib/utils";
import { useEffect, useState } from "react";

const CourseItem = ({
  data,
  cta,
  url = "",
}: {
  data: ICourse;
  cta?: string;
  url?: string;
}) => {
  const [duration, setDuration] = useState<number | null>(0);
  useEffect(() => {
    async function getDuration() {
      const res = await getDurationAndLengthOfCourse(data?.slug);
      setDuration(res?.duration as number);
    }
    getDuration();
  }, [data.slug]);
  const courseUrl = cta ? url : `/course/${data?.slug}`;
  const courseInfo = [
    {
      title: data?.views,
      icon: (className?: string) => <IconEye className={className}></IconEye>,
    },
    {
      title: 5,
      icon: (className?: string) => <IconStar className={className}></IconStar>,
    },
    {
      title: formatTime(duration || 0),
      icon: (className?: string) => (
        <IconClock className={className}></IconClock>
      ),
    },
  ];
  return (
    <div className="bg-white dark:bg-grayDarker dark:border-opacity-10 border border-gray-200 p-4 rounded-2xl">
      <Link href={courseUrl} className="block h-[180px] relative">
        <Image
          src={
            data?.image ||
            "https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt=""
          width={300}
          height={200}
          className="w-full h-full object-cover rounded-lg"
          sizes="@media (min-width: 640px) 300px, 100vw"
          priority
        />
        {/* <span className="inline-block px-3 py-1 rounded-full absolute top-3 right-3 z-10 text-white font-medium bg-green-500 text-xs">
          New
        </span> */}
      </Link>
      <div className="pt-4 ">
        <h3 className="font-bold text-lg mb-3 h-[55px] overflow-hidden">
          <Link href={courseUrl} className="hover:text-primary">
            {" "}
            {data?.title}
          </Link>
        </h3>
        <div className="flex items-center gap-3 mb-5 text-xs text-gray-500 dark:text-grayDark">
          {courseInfo.map((item, index) => (
            <div className="flex items-center gap-2 line-clamp-2" key={index}>
              {item.icon("size-4")}
              <span>{item.title}</span>
            </div>
          ))}

          <span className="font-bold text-primary ml-auto text-base">
            {data?.price === 0 ? (
              <span className="p-2 text-xs font-normal rounded-md text-white bg-green-500 ">
                MIỄN PHÍ
              </span>
            ) : (
              formatMoney(data?.price)
            )}{" "}
          </span>
        </div>

        <Link
          href={courseUrl}
          className="flex items-center justify-center w-full mt-10 rounded-lg text-white font-semibold bg-primary h-12"
        >
          {cta || "Xem chi tiết"}
        </Link>
      </div>
    </div>
  );
};

export default CourseItem;
