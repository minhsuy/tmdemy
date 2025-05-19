"use client";
import { ICourse } from "@/database/course.model";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { createNewLecture, updateLecture } from "@/lib/actions/lecture.action";
import { ICoursePopulated, ICreateLectureParams } from "@/types/type";
import IconEdit from "../icons/IconEdit";
import IconTrash from "../icons/IconTrash";
import { Input } from "../ui/input";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import IconAdd from "../icons/IconAdd";
import IconClose from "../icons/IconClose";

const CourseUpdateContent = ({ data }: { data: ICoursePopulated }) => {
  const { _id, slug, lectures } = data;
  const [idLecture, setIdLecture] = useState("");
  const [titleLecture, setTitleLecture] = useState("");
  const handleCreateNewLecture = async () => {
    try {
      const lecture = createNewLecture({
        course: _id,
        path: `/manage/course/update-content?slug=${slug}`,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteLecture = async (e: any, id: any) => {
    e.stopPropagation();
    try {
      Swal.fire({
        text: `Bạn có muốn xóa chương học này ?`,
        title: "Xóa chương học",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updateLecture({ _id: id, updatedData: { _destroy: true } });
          toast.success("Chương học đã được xóa !");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {lectures &&
        lectures
          .filter((item) => item._destroy === false)
          .map((lecture, index: number) => (
            <Accordion key={index} type="single" collapsible>
              <AccordionItem value={lecture.title}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3 justify-between w-full pr-5">
                    <div>{lecture.title}</div>
                    {idLecture === lecture._id && (
                      <div className="w-full">
                        <Input
                          placeholder="Tên chương"
                          defaultValue={lecture.title}
                          onChange={(e) => setTitleLecture(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      {idLecture === lecture._id ? (
                        <>
                          <span
                            className="cursor-pointer p-2 rounded-md bg-green-500 text-white"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await updateLecture({
                                _id: lecture._id,
                                updatedData: {
                                  title: titleLecture,
                                  path: `/manage/course/update-content?slug=${slug}`,
                                },
                              });
                              setIdLecture("");
                            }}
                          >
                            <IconAdd className="size-4" />
                          </span>
                          <span
                            className="cursor-pointer p-2 rounded-md bg-red-500 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIdLecture("");
                            }}
                          >
                            <IconClose className="size-4" />
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            className="cursor-pointer p-2 rounded-md bg-green-500 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIdLecture(lecture._id);
                            }}
                          >
                            <IconEdit className="size-4" />
                          </span>
                          <span
                            className="cursor-pointer p-2 rounded-md bg-red-500 text-white"
                            onClick={(e) => handleDeleteLecture(e, lecture._id)}
                          >
                            <IconTrash className="size-4" />
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>hashasdh</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
      <Button className="text-white" onClick={handleCreateNewLecture}>
        Thêm chương học mới
      </Button>
    </div>
  );
};

export default CourseUpdateContent;
