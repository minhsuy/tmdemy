"use client";
import { CourseGrid } from "@/components/common";
import CourseItem from "@/components/course/CourseItem";
import { ICourse } from "@/database/course.model";
import { ECourseStatus } from "@/types/enums";
import { useEffect, useState } from "react";

const StudyCourses = ({ courseList }: { courseList: ICourse[] }) => {
  const [lastLesson, setLastLesson] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = JSON.parse(localStorage?.getItem("lastLesson") || "[]");
      setLastLesson(data || []);
    }
  }, []);

  if (!courseList) return null;

  return (
    <CourseGrid>
      {courseList
        .filter(
          (course: ICourse) =>
            course.status === ECourseStatus.ACTIVE && !course._destroy
        )
        .map((courseItem: any) => {
          const courseUrl =
            lastLesson.find((item) => item.course === courseItem.slug)?.url ||
            `/${courseItem.slug}/lesson?slug=${courseItem?.lectures[0]?.lessons[0]?.slug}`;
          return (
            <CourseItem
              key={courseItem._id}
              data={JSON.parse(JSON.stringify(courseItem))}
              cta="Tiếp tục học"
              url={courseUrl}
            />
          );
        })}
    </CourseGrid>
  );
};

export default StudyCourses;
