"use client";
import { createNewOrder } from "@/lib/actions/order.actions";
import { IUser } from "@/types/type";
import { createOrderCode } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CouponForm from "./CouponForm";
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
  const [priceAfterCoupon, setPriceAfterCoupon] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponId, setCouponId] = useState<string>("");
  const handleErrolCourse = async (price: number) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thực hiện chức năng này !");
      return;
    }
    const code = createOrderCode();
    if (priceAfterCoupon > 0) {
      price = priceAfterCoupon;
    }
    const res = await createNewOrder({
      user: user?._id,
      course: courseId,
      code,
      amount: price,
      total: price,
      coupon: couponId,
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
    <div>
      {price > 0 ? (
        <div>
          <CouponForm
            courseId={courseId}
            priceAfterCoupon={priceAfterCoupon}
            setPriceAfterCoupon={setPriceAfterCoupon}
            price={price}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            setCouponId={setCouponId}
          ></CouponForm>
          <button
            className="flex items-center justify-center w-full mt-10 rounded-lg text-white font-semibold bg-primary h-10"
            onClick={() => handleErrolCourse(price)}
          >
            Mua ngay
          </button>
        </div>
      ) : (
        <button
          className="flex items-center justify-center w-full mt-10 rounded-lg text-white font-semibold bg-primary h-10"
          onClick={() => handleErrolCourse(price)}
        >
          Nhận khóa học
        </button>
      )}
    </div>
  );
};

export default LinkToErrolCourse;
