import PageNotFound from "@/app/not-found";
import IconArrowLeft from "@/components/icons/IconArrowLeft";
import IconArrowRight from "@/components/icons/IconArrowRight";
import { Button } from "@/components/ui/button";
import { ILesson } from "@/database/lesson.model";
import { getCourseBySlug, viewsCourse } from "@/lib/actions/course.actions";
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
import { ICourse } from "@/database/course.model";
import LessonContent from "@/components/lesson/LessonContent";
import { auth } from "@clerk/nextjs/server";
import { getUserInfo } from "@/lib/actions/user.action";
import { EUserRole } from "@/types/enums";
import { getHistory } from "@/lib/actions/history.action";
import LessonSaveUrl from "./LessonSaveUrl";
import RatingButton from "./RatingButton";
import LessonComment from "./LessonComment";
import { getCommentByLesson } from "@/lib/actions/comment.action";
import QuizList from "@/components/quiz/QuizList";
import CodeExerciseList from "@/components/code/CodeExerciseList";

const page = async ({
  params,
  searchParams,
}: {
  params: {
    course: string;
  };
  searchParams: {
    slug: string;
    isDemo: string;
  };
}) => {
  const { isDemo } = searchParams;
  const { course } = params;

  const findCourse = await getCourseBySlug({ slug: course });
  if (!findCourse.data) return <PageNotFound />;

  const { userId } = await auth();
  if (!userId && !isDemo) return <PageNotFound />;

  let user = null;
  if (userId) {
    user = await getUserInfo({ userId });
  }
  if (!user && !isDemo) return <PageNotFound />;
  const courseId = findCourse.data._id.toString();
  const { data }: { data: ICourse } = findCourse;
  const { slug } = searchParams;
  const lesson = await getLessonBySlug({
    slug,
    course: courseId,
  });
  if (isDemo) {
    if (!lesson.data || !lesson.data.isDemo)
      return <PageNotFound></PageNotFound>;
  } else {
    if (
      user &&
      !user.courses.includes(findCourse.data._id.toString()) &&
      user.role !== EUserRole.ADMIN
    ) {
      return <PageNotFound />;
    }
  }

  const getAllLessons = await getAllLesson({ course: courseId });
  if (!getAllLessons && !getAllLessons.data)
    return <PageNotFound></PageNotFound>;
  if (!lesson || !lesson.data) return <PageNotFound></PageNotFound>;
  const { data: lessonList }: { data: ILesson[] } = getAllLessons;
  const { data: lessonDetail }: { data: ILesson } = lesson;

  const findLesson = lessonList.findIndex(
    (lesson) => lessonDetail.slug === lesson.slug
  );
  if (findLesson === -1) return <PageNotFound></PageNotFound>;
  const prevLesson = lessonList[findLesson - 1];
  const nextLesson = lessonList[findLesson + 1];
  const getHistories = await getHistory({ course: data._id.toString() });
  const percentage =
    ((getHistories?.length as number) / lessonList.length) * 100;
  const url = new URL(lessonDetail.video_url);
  const videoId = url.searchParams.get("v");
  // console.log(lessonDetail); // CURRENT LESSON
  const comments = await getCommentByLesson({
    lesson: lessonDetail._id.toString(),
    course: courseId,
  });
  return (
    <div className="grid xl:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-10 min-h-screen items-start">
      <div>
        <LessonSaveUrl
          course={course}
          slug={slug}
          url={`/${course}/lesson?slug=${slug}`}
        ></LessonSaveUrl>
        <div className="relative mb-5 aspect-video">
          <iframe
            allowFullScreen
            className="w-full h-full object-fill rounded-md"
            src={`https://www.youtube.com/embed/${videoId}`}
          ></iframe>
        </div>
        {!isDemo && (
          <>
            <div className="flex items-center justify-between">
              <LessonNavigation
                course={course}
                prevLesson={prevLesson?.slug}
                nextLesson={nextLesson?.slug}
              ></LessonNavigation>

              {user && (
                <RatingButton
                  data={{ courseId, userId: user._id }}
                ></RatingButton>
              )}
            </div>
          </>
        )}
        <Heading className="my-10">{lessonDetail.title}</Heading>
        {!isDemo && (
          <>
            {lessonDetail.content && (
              <div className="p-5 rounded-lg bgDarkMode border border-gray-300 entry-content mb-5">
                <div
                  dangerouslySetInnerHTML={{
                    __html: lessonDetail.content || "",
                  }}
                ></div>
              </div>
            )}
            
            {/* Quiz Section */}
            <div className="mb-8">
              <QuizList 
                lessonId={lessonDetail._id} 
                courseSlug={course}
              />
            </div>
            
            {/* Code Exercise Section */}
            <div className="mb-8">
              <CodeExerciseList 
                lessonId={lessonDetail._id} 
                courseSlug={course}
              />
            </div>
            
            {/* comment */}
            <LessonComment
              data={{
                course: courseId,
                lesson: lessonDetail._id,
                user: user._id,
                slug: slug,
              }}
              comments={comments}
            ></LessonComment>
          </>
        )}
      </div>

      {!isDemo && (
        <>
          <div className="sticky top-5 right-0 max-h-[calc(100svh-100px)] overflow-y-auto">
            <div className="h-3 w-full rounded-full border border-gray-300 mb-2 ">
              <div
                className="h-full w-0 rounded-full transition-all duration-300 bg-primary"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <LessonContent
              getHistories={getHistories}
              data={data}
              course={course}
              slug={slug}
            ></LessonContent>
          </div>
        </>
      )}
    </div>
  );
};

export default page;
