"use client";
import { lessonSaveKey } from "@/constants";
import React, { useEffect } from "react";

const LessonSaveUrl = ({
  url,
  slug,
  course,
}: {
  url: string;
  slug: string;
  course: string;
}) => {
  useEffect(() => {
    let result: any[] =
      JSON.parse(localStorage.getItem(lessonSaveKey) || "[]") || [];
    const item = {
      url,
      slug,
      course,
    };
    result = result.filter((item) => item.course !== course);
    result.push(item);
    localStorage.setItem(lessonSaveKey, JSON.stringify(result));
  }, [url, slug, course]);
  return null;
};

export default LessonSaveUrl;
