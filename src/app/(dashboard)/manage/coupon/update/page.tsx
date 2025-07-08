import React from "react";

import Heading from "@/components/typography/Heading";
import { getCouponByCode } from "@/lib/actions/coupon.action";
import PageNotFound from "@/app/not-found";
import { CouponUpdate } from "./CouponUpdate";

const page = async ({
  searchParams,
}: {
  searchParams: {
    code: string;
  };
}) => {
  const { code } = searchParams;
  const coupon = await getCouponByCode(code);
  if (!coupon) return <PageNotFound></PageNotFound>;
  return (
    <div>
      <Heading>Cập nhật coupon</Heading>
      <CouponUpdate data={JSON.parse(JSON.stringify(coupon))}></CouponUpdate>
    </div>
  );
};

export default page;
