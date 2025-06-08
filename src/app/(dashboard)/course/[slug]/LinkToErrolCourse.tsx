"use client";
import { createNewOrder } from "@/lib/actions/order.actions";
import { IUser } from "@/types/type";
import { createOrderCode } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
const LinkToErrolCourse = ({
  user,
  courseId,
  price,
}: {
  user: any | null | undefined;
  courseId: string;
  price: number;
}) => {
  const router = useRouter();
  const handleErrolCourse = async (price: number) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thực hiện chức năng này !");
    }
    const code = createOrderCode();
    const res = await createNewOrder({
      user: user._id,
      course: courseId,
      code,
      amount: price,
      total: price,
    });
    if (!res.success) {
      Swal.fire({
        text: `Đơn hàng của bạn đã được tạo ! Xem đơn hàng bạn đã mua ?`,
        title: "Xem đơn hàng",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
      }).then(async (result) => {
        if (result.isConfirmed) {
          router.push(`/order/${res.data.code}`);
        }
      });
    } else {
      toast.success(res.message);
      router.push(`/order/${code}`);
    }
  };
  return (
    <button
      className="flex items-center justify-center w-full mt-10 rounded-lg text-white font-semibold bg-primary h-10"
      onClick={() => handleErrolCourse(price)}
    >
      {price > 0 ? "Mua ngay" : "Nhận khóa học"}
    </button>
  );
};

export default LinkToErrolCourse;
