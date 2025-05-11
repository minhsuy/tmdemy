import { CourseGrid } from "@/components/common";
import CourseItem from "@/components/course/CourseItem";
import Heading from "@/components/typography/Heading";
import { ICourse } from "@/database/course.model";
import { getCourses } from "@/lib/actions/course.actions";
import React from "react";

const page = async () => {
  const courses = (await getCourses()) || [];
  if (!courses) return null;
  return (
    <div>
      <Heading>Khám phá</Heading>
      <CourseGrid>
        {courses &&
          courses.map((item: ICourse) => (
            <CourseItem
              key={item._id}
              data={JSON.parse(JSON.stringify(item))}
            ></CourseItem>
          ))}
      </CourseGrid>
    </div>
  );
};

export default page;
