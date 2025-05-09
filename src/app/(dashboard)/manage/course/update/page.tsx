import CourseUpdate from "@/components/course/CourseUpdate";
import Heading from "@/components/typography/Heading";
import React from "react";
import { toast } from "react-toastify";

const page = ({
  searchParams,
}: {
  searchParams: {
    slug: string;
  };
}) => {
  const { slug } = searchParams;
  return (
    <div>
      <Heading>Cập nhật khóa học</Heading>
      <CourseUpdate></CourseUpdate>
    </div>
  );
};

export default page;
