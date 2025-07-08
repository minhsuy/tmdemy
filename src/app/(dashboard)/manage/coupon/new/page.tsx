import React from "react";
import Heading from "@/components/typography/Heading";
import { CouponAddNew } from "./CouponAddNew";

const page = () => {
  return (
    <div>
      <Heading className="mb-10">Thêm mới mã giảm giá</Heading>
      <CouponAddNew></CouponAddNew>
    </div>
  );
};

export default page;
