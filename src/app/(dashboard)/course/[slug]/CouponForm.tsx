import { Input } from "@/components/ui/input";
import { checkCouponToUse } from "@/lib/actions/coupon.action";
import { formatMoney } from "@/utils";
import React, { useState } from "react";
import { toast } from "react-toastify";

const CouponForm = ({
  courseId,
  priceAfterCoupon,
  setPriceAfterCoupon,
  couponCode,
  setCouponCode,
  price,
  setCouponId,
}: {
  courseId: string;
  priceAfterCoupon: number;
  price: number;
  setPriceAfterCoupon: React.Dispatch<React.SetStateAction<number>>;
  setCouponCode: React.Dispatch<React.SetStateAction<string>>;
  setCouponId: React.Dispatch<React.SetStateAction<string>>;
  couponCode: string;
}) => {
  const handleCheckCoupon = async () => {
    const coupon = await checkCouponToUse({ code: couponCode, courseId });
    if (!coupon.success) {
      toast.error(coupon.message);
    } else {
      setPriceAfterCoupon(price - (price * coupon.data.value) / 100);
      setCouponId(coupon.data._id);
      toast.success(
        `Bạn đã được giảm ${
          coupon.data.value
        }% , giá khóa học còn lại ${formatMoney(
          price - (price * coupon.data.value) / 100
        )} vnđ`
      );
    }
  };
  return (
    <div className="mt-5 relative">
      <Input
        placeholder="Nhập mã giảm giá"
        className="pr-20 uppercase font-semibold"
        onChange={(e) => setCouponCode(e.target.value)}
      />
      <button
        className="absolute right-5 top-1/2 -translate-y-1/2 font-medium text-sm"
        onClick={handleCheckCoupon}
      >
        Áp dụng
      </button>
    </div>
  );
};

export default CouponForm;
