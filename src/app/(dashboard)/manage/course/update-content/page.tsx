import PageNotFound from "@/app/not-found";
import CourseUpdateContent from "@/components/course/CourseUpdateContent";
import Heading from "@/components/typography/Heading";
import { ICourse } from "@/database/course.model";
import { getCourseBySlug } from "@/lib/actions/course.actions";
import { ECourseStatus } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: {
    slug: string;
  };
}) => {
  const { slug } = searchParams;
  const course = await getCourseBySlug({ slug });
  const { data }: { data: ICourse } = course;
  if (!data)
    return (
      <div className="text-center text-white p-4 rounded-md bg-red-500">
        Không tìm thấy khóa học{" "}
      </div>
    );

  return (
    <div>
      <Heading className="mb-10">
        Nội dung: <strong className="text-primary">{data.title}</strong>
      </Heading>
      <CourseUpdateContent
        data={JSON.parse(JSON.stringify(data))}
      ></CourseUpdateContent>
    </div>
  );
};

export default page;
