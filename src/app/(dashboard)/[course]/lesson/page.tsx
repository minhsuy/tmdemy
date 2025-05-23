import PageNotFound from "@/app/not-found";
import IconArrowLeft from "@/components/icons/IconArrowLeft";
import IconArrowRight from "@/components/icons/IconArrowRight";
import { Button } from "@/components/ui/button";
import { ILesson } from "@/database/lesson.model";
import { getCourseBySlug } from "@/lib/actions/course.actions";
import { getLessonBySlug } from "@/lib/actions/lesson.actions";
import React from "react";

const page = async ({
  params,
  searchParams,
}: {
  params: {
    course: string;
  };
  searchParams: {
    slug: string;
  };
}) => {
  const { course } = params;
  const findCourse = await getCourseBySlug({ slug: course });
  if (!findCourse.data) return <PageNotFound></PageNotFound>;
  const { slug } = searchParams;
  const lesson = await getLessonBySlug({
    slug,
    course: findCourse.data._id.toString(),
  });
  if (!lesson || !lesson.data) return <PageNotFound></PageNotFound>;
  const { data }: { data: ILesson } = lesson;
  const url = new URL(data.video_url);
  const videoId = url.searchParams.get("v");
  return (
    <div className="grid lg:grid-cols-[2fr,1fr] gap-10 min-h-screen">
      <div>
        <div className="relative mb-5 aspect-video">
          <iframe
            allowFullScreen
            className="w-full h-full object-fill"
            src={`https://www.youtube.com/embed/${videoId}`}
          ></iframe>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button className="size-10 p-3 text-white">
              <IconArrowLeft />
            </Button>
            <Button className="size-10 p-3 text-white">
              <IconArrowRight />
            </Button>
          </div>
          <div></div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default page;
