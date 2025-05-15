import CourseManage from "@/components/course/CourseManage";
import { getCourses } from "@/lib/actions/course.actions";
import React from "react";

const page = async () => {
  const courses = await getCourses();
  if (!courses) return null;
  return (
    <div>
      <CourseManage
        courses={JSON.parse(JSON.stringify(courses))}
      ></CourseManage>
    </div>
  );
};

export default page;
