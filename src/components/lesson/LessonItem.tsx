import React from "react";
import { IconPlay } from "../icons";
import { ILesson } from "@/database/lesson.model";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LessonItem = ({
  lesson,
  url,
  isActive,
}: {
  lesson: {
    title: string;
    duration: number;
  };
  url?: string;
  isActive?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 bgDarkMode border borderDarkMode rounded-lg p-4 font-medium text-sm border-gray-400",
        isActive
          ? "text-white bg-primary font-semibold border-none pointer-events-none"
          : ""
      )}
    >
      <IconPlay className="size-5 flex-shrink-0" />
      {url ? (
        <Link href={url} className="line-clamp-1">
          {lesson.title}
        </Link>
      ) : (
        <h4 className="line-clamp-1">{lesson.title}</h4>
      )}
      <span className="ml-auto text-xs font-semibold flex-shrink-0">
        {lesson.duration} phút
      </span>
    </div>
  );
};

export default LessonItem;
