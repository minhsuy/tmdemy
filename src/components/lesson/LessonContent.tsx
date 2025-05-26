import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ICourse } from "@/database/course.model";
import LessonItem from "./LessonItem";
import { IHistory } from "@/database/history.model";
const LessonContent = ({
  data,
  course,
  slug,
  getHistories = [],
}: {
  data: any;
  course?: string;
  slug?: string;
  getHistories?: IHistory[];
}) => {
  return (
    <div className="flex flex-col ">
      {data?.lectures?.map((lecture: any) => (
        <Accordion
          type="single"
          collapsible
          className="w-full"
          key={lecture._id}
        >
          <AccordionItem value={lecture._id}>
            <AccordionTrigger>
              <div className="flex items-center gap-3 justify-between w-full pr-5">
                <div>{lecture.title}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="!bg-transparent border-none p-0">
              <div className="flex flex-col gap-3">
                {lecture.lessons.map((lesson: any) => (
                  <LessonItem
                    url={course ? `/${course}/lesson?slug=${lesson.slug}` : ""}
                    key={lesson._id}
                    lesson={lesson}
                    isActive={lesson.slug === slug}
                    isChecked={getHistories.some(
                      (history) =>
                        history.lesson.toString() === lesson._id.toString()
                    )}
                  ></LessonItem>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default LessonContent;
