import PageNotFound from "@/app/not-found";
import CourseAddNew from "@/components/course/CourseAddNew";
import Heading from "@/components/typography/Heading";
import { getUserInfo } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const page = async () => {
  const { userId } = await auth();
  if (!userId) {
    return <PageNotFound />;
  }
  const user = await getUserInfo({ userId });
  if (!user) return null;
  return (
    <div>
      <Heading>Tạo khóa học mới</Heading>
      <CourseAddNew user={user}></CourseAddNew>
    </div>
  );
};

export default page;
