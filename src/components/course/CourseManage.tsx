"use client";
import React, { useCallback, useEffect, useState } from "react";
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
import { Input } from "../ui/input";
import IconArrowLeft from "../icons/IconArrowLeft";
import IconArrowRight from "../icons/IconArrowRight";
import IconAdd from "../icons/IconAdd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "lodash";
const CourseManage = ({ courses }: { courses: ICourse[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
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
    if (status === ECourseStatus.ACTIVE) {
      Swal.fire({
        text: `Bạn có muốn hủy duyệt khóa học này ?`,
        title: "Hủy duyệt khóa học",
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
              status: ECourseStatus.PENDING,
            },
          });
          toast.success("Khóa học đã được duyệt !");
        }
      });
    } else
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
              status: ECourseStatus.ACTIVE,
            },
          });
          toast.success("Khóa học đã được duyệt !");
        }
      });
  };
  const handleSearchCourses = debounce((value: string) => {
    router.push(pathname + "?" + createQueryString("search", value));
  }, 700);
  const handleGetStatusCourse = (value: string) => {
    router.push(pathname + "?" + createQueryString("status", value));
  };
  const [page, setPage] = useState(1);
  const handleChangePage = (action: "next" | "prev") => {
    if (action === "prev" && page === 1) return;
    if (action === "prev") setPage(page - 1);
    else setPage(page + 1);
  };
  useEffect(() => {
    router.push(pathname + "?" + createQueryString("page", page + ""));
  }, [page]);
  return (
    <div>
      <Link
        href="/manage/course/new"
        className="size-10 rounded-full bg-primary flexCenter text-white fixed right-5 bottom-10 hover hover:animate-spin"
      >
        <IconAdd className="size-6"></IconAdd>
      </Link>
      <div className="flex flex-col lg:flex-row lg:items-center gap-5 justify-between mb-10 mr-2">
        <Heading className="">Quản lý khóa học</Heading>
        <div className="w-[300px]">
          <Input
            placeholder="Tìm kiếm khóa học..."
            onChange={(e) => handleSearchCourses(e.target.value)}
          />
        </div>
        <Select onValueChange={(value) => handleGetStatusCourse(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {courseStatus &&
              courseStatus.length > 0 &&
              courseStatus.map((status) => (
                <SelectItem value={status.value} key={status.value}>
                  {status.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
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
                      <h3
                        className={`font-bold  text-sm lg:text-base whitespace-nowrap ${
                          courseItem?._destroy && "line-through text-red-500 "
                        }`}
                      >
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
                    {courseItem?.price}đ
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    onClick={() =>
                      handleChangeStatus(courseItem?.slug, courseItem?.status)
                    }
                    className={cn(
                      "p-2 rounded-md cursor-pointer whitespace-nowrap",
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
                      href={`/manage/course/update-content?slug=${courseItem?.slug}`}
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
      <div className="flex justify-end gap-3 mt-5">
        <button
          className="p-2  rounded-md hover dark:text-black  hover:text-white hover:bg-primary dark:hover:text-white dark:hover:bg-primary bg-slate-100"
          onClick={() => handleChangePage("prev")}
        >
          <IconArrowLeft className="size-7"></IconArrowLeft>
        </button>
        <button
          className="p-2  rounded-md hover dark:text-black hover:text-white hover:bg-primary bg-slate-100 dark:hover:text-white dark:hover:bg-primary"
          onClick={() => handleChangePage("next")}
        >
          <IconArrowRight className="size-7"></IconArrowRight>
        </button>
      </div>
    </div>
  );
};

export default CourseManage;
