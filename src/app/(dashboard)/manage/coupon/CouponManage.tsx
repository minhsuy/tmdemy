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
import { IOrderManage } from "@/types/type";
import { formatMoney } from "@/utils";
import { debounce } from "lodash";
import useQueryString from "@/hooks/useQueryString";
import { ECouponType, EOrderStatus } from "@/types/enums";
import { updateOrder } from "@/lib/actions/order.actions";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { allItem, couponStatus, orderStatus } from "@/constants";
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
const CouponManage = ({ coupons }: { coupons: ICoupon[] }) => {
  const { createQueryString, pathname, router } = useQueryString();
  const handleSearchCouponCode = debounce((value: string) => {
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
      router.push(pathname + "?" + createQueryString("active", "true"));
    else if (value === "INACTIVE")
      router.push(pathname + "?" + createQueryString("active", "false"));
    else router.push(pathname);
  };
  const handleDeleteCoupon = async (code: string) => {
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
          await deleteCoupon(code, "/manage/coupon");
          toast.success("Coupon đã được xóa !");
        }
      });
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
        <Heading>Quản lý coupon</Heading>
        <div className="w-[300px]">
          <Input
            placeholder="Tìm kiếm theo mã coupon..."
            onChange={(e) => handleSearchCouponCode(e.target.value)}
          />
        </div>
        <Select onValueChange={(value) => handleFilterCoupon(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={allItem} key={allItem}>
              {"Tất cả"}
            </SelectItem>
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
            <TableHead>Mã</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Giảm giá</TableHead>
            <TableHead>Sử dụng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons &&
            coupons.length > 0 &&
            coupons.map((coupon: ICoupon) => (
              <TableRow key={coupon._id} className="font-medium">
                <TableCell className="font-bold">{coupon.code}</TableCell>
                <TableCell>{coupon.title}</TableCell>
                <TableCell>{coupon.value}%</TableCell>
                <TableCell>
                  {coupon.used} / {coupon.limit}
                </TableCell>
                <TableCell>
                  {coupon.active ? (
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
                    <Link
                      className="p-2 bg-green-500 rounded-md text-white"
                      href={`/manage/coupon/update?code=${coupon.code}`}
                    >
                      <IconEdit className="size-4" />
                    </Link>
                    <button
                      className="p-2 bg-red-500 rounded-md text-white"
                      onClick={() => handleDeleteCoupon(coupon.code)}
                    >
                      <IconTrash className="size-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="flex justify-end gap-3 mt-5 mb-16">
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

export default CouponManage;
