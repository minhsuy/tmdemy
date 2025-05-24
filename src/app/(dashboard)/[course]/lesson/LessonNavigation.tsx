"use client";
import IconArrowLeft from "@/components/icons/IconArrowLeft";
import IconArrowRight from "@/components/icons/IconArrowRight";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const LessonNavigation = ({
  course,
  prevLesson,
  nextLesson,
}: {
  course: string;
  prevLesson: string;
  nextLesson: string;
}) => {
  const router = useRouter();

  return (
    <div className="flex gap-3">
      <Button
        disabled={!prevLesson}
        className="size-10 p-3 bg-black text-white hover hover:bg-primary"
        onClick={() => router.push(`/${course}/lesson?slug=${prevLesson}`)}
      >
        <IconArrowLeft />
      </Button>
      <Button
        disabled={!nextLesson}
        className="size-10 p-3 bg-black  text-white hover hover:bg-primary"
        onClick={() => router.push(`/${course}/lesson?slug=${nextLesson}`)}
      >
        <IconArrowRight />
      </Button>
    </div>
  );
};

export default LessonNavigation;
