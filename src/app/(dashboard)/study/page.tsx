import PageNotFound from "@/app/not-found";
import { CourseGrid } from "@/components/common";
import CourseItem from "@/components/course/CourseItem";
import Heading from "@/components/typography/Heading";
import { ICourse } from "@/database/course.model";
import { getCourses } from "@/lib/actions/course.actions";
import { getUserCourses } from "@/lib/actions/user.action";
import { ECourseStatus, EUserRole } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import StudyDashboard from "@/components/study/StudyDashboard";

const page = async () => {
  const { userId } = await auth();
  if (!userId) return;
  const userCourses = await getUserCourses({ userId });
  const getAllCourse = await getCourses({});
  const courseList =
    userCourses?.role === EUserRole.ADMIN ? getAllCourse : userCourses.courses;
  return (
    <div>
      <Heading>Khu vực học tập</Heading>
      <StudyDashboard
        courseList={courseList ? JSON.parse(JSON.stringify(courseList)) : []}
      />
    </div>
  );
};

export default page;
