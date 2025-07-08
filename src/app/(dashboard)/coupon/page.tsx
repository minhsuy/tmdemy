import Heading from "@/components/typography/Heading";
import { getCoupons } from "@/lib/actions/coupon.action";
import React from "react";
import FreeCouponForm from "./FreeCouponForm";

const page = async () => {
  const coupons = await getCoupons({});
  if (!coupons) return null;
  return (
    <div>
      <Heading>Săn mã giảm giá</Heading>
      <FreeCouponForm coupons={coupons}></FreeCouponForm>
    </div>
  );
};

export default page;
