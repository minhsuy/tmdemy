"use client";
import { ICourse } from "@/database/course.model";
import React, { MouseEvent, useState } from "react";
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
import { createNewLesson, updateLesson } from "@/lib/actions/lesson.actions";
import Lesson from "@/database/lesson.model";
import LessonItemUpdate from "../lesson/LessonItemUpdate";
import slugify from "slugify";

const CourseUpdateContent = ({ data }: { data: ICoursePopulated }) => {
  const { _id, slug, lectures } = data;
  const [idLecture, setIdLecture] = useState("");
  const [titleLecture, setTitleLecture] = useState("");
  const [idLesson, setIdLesson] = useState("");
  const [titleLesson, setTitleLesson] = useState("");
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
  const handleCreateNewLesson = async (
    e: MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    try {
      const newLesson = await createNewLesson({
        course: _id,
        lecture: id,
        title: "Tiêu đề bài học mới ...",
        path: `/manage/course/update-content?slug=${slug}`,
        slug: `tieu-de-bai-hoc-moi-${new Date()
          .getTime()
          .toString()
          .slice(-6)}`,
      });
      if (newLesson.success) {
        toast.success(newLesson.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateLesson = async (
    e: MouseEvent<HTMLSpanElement>,
    id: string
  ) => {
    e.stopPropagation();
    try {
      const res = await updateLesson({
        _id: id,
        updatedData: {
          title: titleLesson,
          slug: slugify(titleLesson, {
            lower: true,
            locale: "vi",
            remove: /[*+~.()'"!:@,]/g,
          }),

          path: `/manage/course/update-content?slug=${slug}`,
        },
      });
      if (res.success) {
        toast.success(res.message);
        setIdLesson("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteLesson = async (
    e: MouseEvent<HTMLSpanElement>,
    id: string
  ) => {
    e.stopPropagation();
    try {
      Swal.fire({
        text: `Bạn có muốn xóa bài học này ?`,
        title: "Xóa bài học",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await updateLesson({
            _id: id,
            updatedData: {
              _destroy: true,
            },
          });
          if (res.success) {
            toast.success("Bài học đã được xóa thành công !");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="flex flex-col gap-5">
        {lectures &&
          lectures
            .filter((item) => item._destroy === false)
            .map((lecture, index: number) => (
              <div key={index} className="w-full">
                <Accordion type="single" collapsible>
                  <AccordionItem value={lecture.title}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3 justify-between w-full pr-5">
                        {idLecture === lecture._id ? (
                          ""
                        ) : (
                          <div>{lecture.title}</div>
                        )}
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
                                  setTitleLecture(lecture.title);
                                }}
                              >
                                <IconEdit className="size-4" />
                              </span>
                              <span
                                className="cursor-pointer p-2 rounded-md bg-red-500 text-white"
                                onClick={(e) =>
                                  handleDeleteLecture(e, lecture._id)
                                }
                              >
                                <IconTrash className="size-4" />
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    {/* lesson */}
                    <AccordionContent className="border-none !bg-transparent">
                      <div className="flex flex-col gap-4">
                        {lecture.lessons.map((Lesson: any, index: number) => (
                          <>
                            <Accordion type="single" collapsible key={index}>
                              <AccordionItem value={Lesson.title}>
                                <AccordionTrigger>
                                  <div className="flex items-center gap-3 justify-between w-full pr-5">
                                    {idLesson === Lesson._id ? (
                                      ""
                                    ) : (
                                      <div>{Lesson.title}</div>
                                    )}
                                    {idLesson === Lesson._id && (
                                      <div className="w-full">
                                        <Input
                                          placeholder="Tên bài học"
                                          defaultValue={Lesson.title}
                                          onChange={(e) =>
                                            setTitleLesson(e.target.value)
                                          }
                                        />
                                      </div>
                                    )}
                                    <div className="flex gap-2">
                                      {idLesson === Lesson._id ? (
                                        <>
                                          <span
                                            className="cursor-pointer p-2 rounded-md bg-green-500 text-white"
                                            onClick={(e) =>
                                              handleUpdateLesson(e, Lesson._id)
                                            }
                                          >
                                            <IconAdd className="size-4" />
                                          </span>
                                          <span
                                            className="cursor-pointer p-2 rounded-md bg-red-500 text-white"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setIdLesson("");
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
                                              setIdLesson(Lesson._id);
                                              setTitleLesson(Lesson.title);
                                            }}
                                          >
                                            <IconEdit className="size-4" />
                                          </span>
                                          <span
                                            className="cursor-pointer p-2 rounded-md bg-red-500 text-white"
                                            onClick={(e) =>
                                              handleDeleteLesson(e, Lesson._id)
                                            }
                                          >
                                            <IconTrash className="size-4" />
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <LessonItemUpdate
                                    path={`/manage/course/update-content?slug=${slug}`}
                                    lesson={Lesson}
                                  ></LessonItemUpdate>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Button
                  className="mt-5 text-white ml-auto w-fit block"
                  onClick={(e) => handleCreateNewLesson(e, lecture._id)}
                >
                  Thêm bài học
                </Button>
              </div>
            ))}
      </div>

      <Button className="text-white mt-5" onClick={handleCreateNewLecture}>
        Thêm chương học mới
      </Button>
    </div>
  );
};

export default CourseUpdateContent;
