import { CourseGrid } from "@/components/common";
import CourseItem from "@/components/course/CourseItem";
import Heading from "@/components/typography/Heading";
import { ICourse } from "@/database/course.model";
import { getCourses } from "@/lib/actions/course.actions";
import { ECourseStatus } from "@/types/enums";
import React from "react";
import PageNotFound from "../not-found";

const page = async () => {
  const courses =
    (await getCourses({
      limit: 10,
      status: ECourseStatus.ACTIVE,
      page: 1,
    })) || [];
  if (!courses) return null;
  return (
    <div>
      <Heading>Khám phá</Heading>
      <CourseGrid>
        {courses &&
          courses
            .filter(
              (course: ICourse) =>
                course.status === ECourseStatus.ACTIVE && !course._destroy
            )
            .map((courseItem: ICourse) => (
              <CourseItem
                key={courseItem._id}
                data={JSON.parse(JSON.stringify(courseItem))}
              ></CourseItem>
            ))}
      </CourseGrid>
    </div>
  );
};

export default page;
