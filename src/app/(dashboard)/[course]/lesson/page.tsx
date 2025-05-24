import PageNotFound from "@/app/not-found";
import IconArrowLeft from "@/components/icons/IconArrowLeft";
import IconArrowRight from "@/components/icons/IconArrowRight";
import { Button } from "@/components/ui/button";
import { ILesson } from "@/database/lesson.model";
import { getCourseBySlug } from "@/lib/actions/course.actions";
import { getAllLesson, getLessonBySlug } from "@/lib/actions/lesson.actions";
import React from "react";
import LessonNavigation from "./LessonNavigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LessonItem from "@/components/lesson/LessonItem";
import Heading from "@/components/typography/Heading";

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
  const courseId = findCourse.data._id.toString();
  if (!findCourse.data) return <PageNotFound></PageNotFound>;
  const { slug } = searchParams;
  const lesson = await getLessonBySlug({
    slug,
    course: courseId,
  });
  const getAllLessons = await getAllLesson({ course: courseId });
  if (!getAllLessons && !getAllLessons.data)
    return <PageNotFound></PageNotFound>;
  if (!lesson || !lesson.data) return <PageNotFound></PageNotFound>;
  const { data: lessonList }: { data: ILesson[] } = getAllLessons;
  const { data }: { data: ILesson } = lesson;
  const url = new URL(data.video_url);
  const videoId = url.searchParams.get("v");
  const findLesson = lessonList.findIndex(
    (lesson) => data.slug === lesson.slug
  );
  if (findLesson === -1) return <PageNotFound></PageNotFound>;
  const prevLesson = lessonList[findLesson - 1];
  const nextLesson = lessonList[findLesson + 1];

  return (
    <div className="grid xl:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-10 min-h-screen items-start">
      <div>
        <div className="relative mb-5 aspect-video">
          <iframe
            allowFullScreen
            className="w-full h-full object-fill rounded-md"
            src={`https://www.youtube.com/embed/${videoId}`}
          ></iframe>
        </div>
        <div className="flex items-center justify-between">
          <LessonNavigation
            course={course}
            prevLesson={prevLesson?.slug}
            nextLesson={nextLesson?.slug}
          ></LessonNavigation>
          <div></div>
        </div>
        <Heading className="my-10">{data.title}</Heading>
        <div className="p-5 rounded-lg bgDarkMode border border-gray-400 entry-content">
          <div dangerouslySetInnerHTML={{ __html: data.content || "" }}></div>
        </div>
      </div>

      <div className="flex flex-col gap-5 mb-10">
        <div className="flex flex-col ">
          {findCourse?.data?.lectures?.map((lecture: any) => (
            <Accordion
              type="single"
              collapsible
              className="w-full"
              key={lecture._id}
            >
              <AccordionItem value={lecture._id}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3 justify-between w-full pr-5">
                    <div>{lecture.title}</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="!bg-transparent border-none p-0">
                  <div className="flex flex-col gap-3">
                    {lecture.lessons.map((lesson: any) => (
                      <LessonItem
                        url={`/${course}/lesson?slug=${lesson.slug}`}
                        key={lesson._id}
                        lesson={lesson}
                        isActive={lesson.slug === slug}
                      ></LessonItem>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
