import CourseItem from "@/components/course/CourseItem";
import Heading from "@/components/typography/Heading";
import React from "react";

const page = () => {
  return (
    <div>
      <Heading>Khám phá</Heading>
      <div className="grid grid-cols-3 gap-8 mt-8">
        <CourseItem></CourseItem>
        <CourseItem></CourseItem>
        <CourseItem></CourseItem>
      </div>
    </div>
  );
};

export default page;
