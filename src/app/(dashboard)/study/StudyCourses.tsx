"use client";
import { CourseGrid } from "@/components/common";
import CourseItem from "@/components/course/CourseItem";
import { ICourse } from "@/database/course.model";
import { ECourseStatus } from "@/types/enums";
import React from "react";

const StudyCourses = ({ courseList }: { courseList: ICourse[] }) => {
  if (!courseList) return null;
  const lastLesson =
    JSON.parse(localStorage?.getItem("lastLesson") || "[]") || [];
  return (
    <CourseGrid>
      {courseList &&
        courseList
          .filter(
            (course: ICourse) =>
              course.status === ECourseStatus.ACTIVE && !course._destroy
          )
          .map((courseItem: any) => {
            const courseUrl =
              (lastLesson &&
                lastLesson.length > 0 &&
                lastLesson?.find((item: any) => item.course === courseItem.slug)
                  ?.url) ||
              `/${courseItem.slug}/lesson?slug=${courseItem?.lectures[0]?.lessons[0]?.slug}`;
            return (
              <CourseItem
                key={courseItem._id}
                data={JSON.parse(JSON.stringify(courseItem))}
                cta="Tiếp tục học"
                url={courseUrl}
              ></CourseItem>
            );
          })}
    </CourseGrid>
  );
};

export default StudyCourses;
