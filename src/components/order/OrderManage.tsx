"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
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
import { IconEye, IconStudy } from "../icons";
import IconEdit from "../icons/IconEdit";
import IconTrash from "../icons/IconTrash";
import IconArrowLeft from "../icons/IconArrowLeft";
import IconArrowRight from "../icons/IconArrowRight";
import { IOrder } from "@/database/order.model";
import { IOrderManage } from "@/types/type";
import { formatMoney } from "@/utils";
import IconCheck from "../icons/IconCheck";
import IconClose from "../icons/IconClose";
import { allItem, orderStatus } from "@/constants";
import Heading from "../typography/Heading";
import { debounce } from "lodash";
import useQueryString from "@/hooks/useQueryString";
import { EOrderStatus } from "@/types/enums";
import { updateOrder } from "@/lib/actions/order.actions";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
const CourseManage = ({ orders }: { orders: IOrderManage[] }) => {
  const { createQueryString, pathname, router } = useQueryString();
  const handleSearchOrder = debounce((value: string) => {
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
  const handleFilterOrder = (value: string) => {
    if (value === allItem) router.push(pathname);
    else router.push(pathname + "?" + createQueryString("status", value));
  };
  const handleUpdateOrder = async (
    action: EOrderStatus.COMPLETED | EOrderStatus.CANCELLED,
    status: EOrderStatus,
    _id: string
  ) => {
    try {
      if (action === EOrderStatus.COMPLETED) {
        const res = await updateOrder({
          _id,
          action,
          status,
        });
        if (res.success) {
          toast.success(res.message);
        }
      } else {
        Swal.fire({
          text: `Bạn có muốn hủy đơn hàng này ?`,
          title: "Hủy đơn hàng",
          icon: "error",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Đồng ý",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const res = await updateOrder({
              _id,
              action,
              status,
            });
            if (res.success) {
              toast.success(res.message);
            }
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center gap-5 justify-between mb-24 mr-2">
        <Heading>Quản lý đơn hàng</Heading>
        <div className="w-[300px]">
          <Input
            placeholder="Tìm kiếm theo mã đơn hàng..."
            onChange={(e) => handleSearchOrder(e.target.value)}
          />
        </div>
        <Select onValueChange={(value) => handleFilterOrder(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={allItem} key={allItem}>
              {"Tất cả"}
            </SelectItem>
            {orderStatus &&
              orderStatus.length > 0 &&
              orderStatus.map((status) => (
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
            <TableHead>Mã đơn hàng</TableHead>
            <TableHead>Khóa học</TableHead>
            <TableHead>Thành viên</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Mã giảm giá</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders &&
            orders.length > 0 &&
            orders.map((order) => (
              <TableRow key={order.code} className="font-medium">
                <TableCell className="font-bold">{order.code}</TableCell>
                <TableCell>{order.course.title}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      orderStatus.find(
                        (status) => status.value === order.status
                      )?.className
                    )}
                  >
                    {order.total === 0 ? "Miễn phí" : formatMoney(order.total!)}
                  </span>
                </TableCell>
                <TableCell>ABC</TableCell>
                <TableCell>
                  <span
                    className={
                      orderStatus.find(
                        (status) => status.value === order.status
                      )?.className
                    }
                  >
                    {
                      orderStatus.find(
                        (status) => status.value === order.status
                      )?.title
                    }
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <button
                      className="p-2 bg-green-500 rounded-md text-white"
                      disabled={
                        order.status === EOrderStatus.COMPLETED ||
                        order.status === EOrderStatus.CANCELLED
                      }
                      onClick={() =>
                        handleUpdateOrder(
                          EOrderStatus.COMPLETED,
                          order.status,
                          order._id
                        )
                      }
                    >
                      <IconCheck className="size-4" />
                    </button>
                    <button
                      className="p-2 bg-red-500 rounded-md text-white"
                      disabled={order.status === EOrderStatus.CANCELLED}
                      onClick={() =>
                        handleUpdateOrder(
                          EOrderStatus.CANCELLED,
                          order.status,
                          order._id
                        )
                      }
                    >
                      <IconClose className="size-4" />
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

export default CourseManage;
