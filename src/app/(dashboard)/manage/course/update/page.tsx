import CourseUpdate from "@/components/course/CourseUpdate";
import Heading from "@/components/typography/Heading";
import { getCourseBySlug } from "@/lib/actions/course.actions";
import React from "react";
import { toast } from "react-toastify";

const page = async ({
  searchParams,
}: {
  searchParams: {
    slug: string;
  };
}) => {
  const { slug } = searchParams;
  const findCourse = await getCourseBySlug({ slug });
  if (findCourse && findCourse.success) {
    console.log(findCourse);
  } else {
    return null;
  }
  return (
    <div>
      <Heading>Cập nhật khóa học</Heading>
      <CourseUpdate></CourseUpdate>
    </div>
  );
};

export default page;
