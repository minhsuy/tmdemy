"use client";
import React from "react";
import { IconPlay } from "../icons";
import { ILesson } from "@/database/lesson.model";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { createHistory } from "@/lib/actions/history.action";

const LessonItem = ({
  lesson,
  url,
  isActive,
  isChecked = false,
  isDemo = "",
}: {
  lesson: ILesson;
  url?: string;
  isActive?: boolean;
  isChecked?: boolean;
  isDemo?: string;
}) => {
  const handleCreateHistory = async (checked: boolean | string) => {
    try {
      await createHistory({
        checked,
        course: lesson.course.toString(),
        lesson: lesson._id.toString(),
        path: url,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className={cn(
        "flex items-center gap-2 bgDarkMode border borderDarkMode rounded-lg p-3 font-medium text-sm border-slate-300",
        isActive ? "text-primary font-semibold border border-primary " : ""
      )}
    >
      {url && (
        <Checkbox
          defaultChecked={isChecked}
          onCheckedChange={(checked) => handleCreateHistory(checked)}
        ></Checkbox>
      )}
      <IconPlay className="size-5 flex-shrink-0" />
      {url ? (
        <Link href={url} className="line-clamp-1">
          {lesson.title}
        </Link>
      ) : (
        <h4 className={`line-clamp-1 ${isActive ? "pointer-events-none" : ""}`}>
          {lesson.title}
        </h4>
      )}

      <span className="ml-auto text-xs font-semibold flex-shrink-0">
        {lesson.duration} phút
      </span>
      {isDemo && !url && (
        <Link
          className="font-semibold bg-primary rounded-full text-white p-2 text-xs"
          href={isDemo}
        >
          Học thử
        </Link>
      )}
    </div>
  );
};

export default LessonItem;
