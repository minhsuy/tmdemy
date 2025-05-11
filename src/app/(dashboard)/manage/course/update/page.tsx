import PageNotFound from "@/app/not-found";
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
  if (!findCourse.data) return <PageNotFound></PageNotFound>;

  return (
    <div>
      <Heading>Cập nhật khóa học</Heading>
      <CourseUpdate
        data={JSON.parse(JSON.stringify(findCourse.data))}
      ></CourseUpdate>
    </div>
  );
};

export default page;
