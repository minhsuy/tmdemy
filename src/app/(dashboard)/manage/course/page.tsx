import CourseManage from "@/components/course/CourseManage";
import { getCourses } from "@/lib/actions/course.actions";
import { ECourseStatus } from "@/types/enums";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: {
    search: string;
    status: ECourseStatus;
    page: string;
  };
}) => {
  const courses = await getCourses({
    limit: 10,
    search: searchParams?.search || "",
    status: Object.values(ECourseStatus).includes(searchParams?.status)
      ? searchParams.status
      : undefined,
    page: Number(searchParams?.page) || 1,
  });
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
