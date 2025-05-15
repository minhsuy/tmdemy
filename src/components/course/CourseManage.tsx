"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { IconEye, IconStudy } from "../icons";
import Link from "next/link";
import IconTrash from "../icons/IconTrash";
import IconEdit from "../icons/IconEdit";
import { courseStatus } from "@/constants";
import Heading from "../typography/Heading";
import { cn } from "@/lib/utils";
import { ICourse } from "@/database/course.model";
import { stat } from "fs";
import Swal from "sweetalert2";
import { updateCourse } from "@/lib/actions/course.actions";
import { ECourseStatus } from "@/types/enums";
import { toast } from "react-toastify";
const CourseManage = ({ courses }: { courses: ICourse[] }) => {
  const handleDeleteCourse = ({
    slug,
    _destroy,
  }: {
    slug: string;
    _destroy: boolean;
  }) => {
    if (_destroy) {
      return Swal.fire({
        text: `Khóa học này đã bị xóa , bạn có muốn khôi phục lại ?`,
        title: "Khôi phục khóa học",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updateCourse({
            slug,
            updateData: { _destroy: false, status: ECourseStatus.PENDING },
          });
          toast.success("Khôi phục khóa học thành công !");
        }
      });
    } else {
      return Swal.fire({
        text: `Bạn có chắc muốn xóa khóa học này ?`,
        title: "Xóa khóa học",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updateCourse({
            slug,
            updateData: { _destroy: true, status: ECourseStatus.PENDING },
          });
          toast.success("Xóa khóa học thành công !");
        }
      });
    }
  };

  const handleChangeStatus = (slug: string, status: string) => {
    Swal.fire({
      text: `Bạn có muốn duyệt khóa học này ?`,
      title: "Duyệt khóa học",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await updateCourse({
          slug,
          updateData: {
            status:
              status === ECourseStatus.PENDING
                ? ECourseStatus.ACTIVE
                : ECourseStatus.PENDING,
          },
        });
        toast.success("Khóa học đã được duyệt !");
      }
    });
  };
  return (
    <div>
      <Heading className="mb-10">Quản lý khóa học</Heading>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thông tin</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses?.length > 0 &&
            courses?.map((courseItem: ICourse) => (
              <TableRow key={courseItem?._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      alt=""
                      src={courseItem?.image}
                      width={80}
                      height={80}
                      className="flex-shrink-0 size-16 rounded-lg object-cover"
                    />
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-base">
                        {courseItem?.title}
                      </h3>
                      <h4 className="text-sm text-slate-500">
                        {new Date(
                          courseItem?.createdAt as string
                        ).toLocaleDateString("vi-VN")}
                      </h4>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-base">
                    {courseItem?.price} VNĐ
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    onClick={() =>
                      handleChangeStatus(courseItem?.slug, courseItem?.status)
                    }
                    className={cn(
                      "p-2 rounded-md cursor-pointer",
                      courseStatus.find(
                        (status) => status.value === courseItem?.status
                      )?.className
                    )}
                  >
                    {
                      courseStatus.find(
                        (status) => status.value === courseItem?.status
                      )?.title
                    }
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Link
                      href="#"
                      className="p-2 bg-primary rounded-md text-white"
                    >
                      <IconStudy className="size-4" />
                    </Link>
                    <Link
                      href={`/course/${courseItem?.slug}`}
                      target="_blank"
                      className="p-2 bg-blue-500 rounded-md text-white"
                    >
                      <IconEye className="size-4" />
                    </Link>
                    <Link
                      href={`/manage/course/update?slug=${courseItem?.slug}`}
                      className="p-2 bg-green-500 rounded-md text-white"
                    >
                      <IconEdit className="size-4" />
                    </Link>
                    <button
                      className="p-2 bg-red-500 rounded-md text-white block cursor-pointer"
                      type="button"
                      onClick={() =>
                        handleDeleteCourse({
                          slug: courseItem?.slug,
                          _destroy: courseItem?._destroy,
                        })
                      }
                    >
                      <IconTrash className="size-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseManage;
