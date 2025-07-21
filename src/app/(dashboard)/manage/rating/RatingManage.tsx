"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IOrder } from "@/database/order.model";
import { IOrderManage, IRatingItem } from "@/types/type";
import { formatMoney } from "@/utils";
import { debounce } from "lodash";
import useQueryString from "@/hooks/useQueryString";
import { EOrderStatus, ERatingStatus } from "@/types/enums";
import { updateOrder } from "@/lib/actions/order.actions";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { couponStatus, orderStatus } from "@/constants";
import IconCheck from "@/components/icons/IconCheck";
import IconClose from "@/components/icons/IconClose";
import IconArrowLeft from "@/components/icons/IconArrowLeft";
import IconArrowRight from "@/components/icons/IconArrowRight";
import { Input } from "@/components/ui/input";
import { ICoupon } from "@/database/coupon.model";
import IconAdd from "@/components/icons/IconAdd";
import IconTrash from "@/components/icons/IconTrash";
import IconEdit from "@/components/icons/IconEdit";
import Heading from "@/components/typography/Heading";
import { deleteCoupon } from "@/lib/actions/coupon.action";
import { IconStar } from "@/components/icons";
import { deleteRating, updateRatingStatus } from "@/lib/actions/rating.action";
const RatingManage = ({ ratings }: { ratings: IRatingItem[] | undefined }) => {
  const { createQueryString, pathname, router } = useQueryString();
  const handleSearchRatingContent = debounce((value: string) => {
    router.push(pathname + "?" + createQueryString("search", value));
  }, 700);
  const [page, setPage] = useState(1);
  const handleChangePage = (action: "prev" | "next") => {
    if (action === "prev" && page === 1) return;
    if (action === "prev") setPage(page - 1);
    else setPage(page + 1);
  };
  useEffect(() => {
    router.push(pathname + "?" + createQueryString("page", page.toString()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  const handleFilterCoupon = (value: string) => {
    if (value === "ACTIVE")
      router.push(
        pathname + "?" + createQueryString("status", ERatingStatus.ACTIVE)
      );
    else
      router.push(
        pathname + "?" + createQueryString("status", ERatingStatus.INACTIVE)
      );
  };
  const handleDeleteRating = async (id: string) => {
    try {
      Swal.fire({
        text: `Bạn có muốn xóa coupon này ?`,
        title: "Xóa coupon",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const res = await deleteRating({ id });
          if (res && res?.success) {
            toast.success(res.message);
          } else {
            toast.error(res?.message || "Something went wrong");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateRating = async (id: string) => {
    try {
      const res = await updateRatingStatus({ id });
      if (res && res?.success) {
        toast.success(res.message);
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Link
        href="/manage/coupon/new"
        className="size-10 rounded-full bg-primary flexCenter text-white fixed right-5 bottom-10 hover hover:animate-spin"
      >
        <IconAdd className="size-6"></IconAdd>
      </Link>
      <div className="flex flex-col lg:flex-row lg:items-center gap-5 justify-between mb-24 mr-2">
        <Heading>Quản lý đánh giá</Heading>
        <div className="w-[300px]">
          <Input
            placeholder="Tìm kiếm đánh giá..."
            onChange={(e) => handleSearchRatingContent(e.target.value)}
          />
        </div>
        <Select onValueChange={(value) => handleFilterCoupon(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {couponStatus &&
              couponStatus.length > 0 &&
              couponStatus.map((status) => (
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
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Khóa học</TableHead>
            <TableHead>Thành viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratings &&
            ratings.length > 0 &&
            ratings.map((rating: IRatingItem) => (
              <TableRow key={rating._id} className="font-medium">
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="flex items-center gap-1 text-yellow-500 text-xs">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <IconStar
                              key={i}
                              className={`size-3  fill-current ${
                                i < rating.rate
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className=" line-clamp-2 max-w-[200px] text-sm">
                          {rating.content}
                        </span>
                      </div>
                    </div>
                    <time>
                      {new Date(rating.createdAt).toLocaleDateString("vi-Vi")}
                    </time>
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/course/${rating.course.slug}`}
                    className="font-semibold hover:text-primary text-gray-800"
                    target="_blank"
                  >
                    {rating.course.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <strong>{rating.user.username}</strong>
                </TableCell>
                <TableCell>
                  {rating.status === ERatingStatus.ACTIVE ? (
                    <span className="bg-green-500 p-2 text-white rounded-md">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="bg-orange-500 p-2 text-white rounded-md">
                      INACTIVE
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <button
                      className={cn(
                        "p-2 rounded-md text-white",
                        rating.status === ERatingStatus.ACTIVE
                          ? "bg-red-500"
                          : "bg-green-500"
                      )}
                      onClick={() => handleUpdateRating(rating._id)}
                    >
                      {rating.status === ERatingStatus.ACTIVE ? (
                        <IconClose className="size-4" />
                      ) : (
                        <IconCheck className="size-4" />
                      )}
                    </button>
                    <button
                      className="p-2 bg-red-500 rounded-md text-white"
                      onClick={() => handleDeleteRating(rating._id)}
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

export default RatingManage;
