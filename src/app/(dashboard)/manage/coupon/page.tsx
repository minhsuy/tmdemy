import React from "react";
import CouponManage from "./ManageCoupon";
import { getCoupons } from "@/lib/actions/coupon.action";
import { BooleanExpressionOperator } from "mongoose";
import { boolean } from "zod";

const page = async ({
  searchParams,
}: {
  searchParams: {
    search: string;
    page: string;
    active: string;
  };
}) => {
  const { search, page, active } = searchParams;
  let activeParsed: boolean | undefined;

  if (active === "true") activeParsed = true;
  else if (active === "false") activeParsed = false;
  else activeParsed = undefined;
  console.log(activeParsed);
  const coupons = await getCoupons({
    search: search || "",
    page: Number(page) || 1,
    active: activeParsed,
  });
  return (
    <div>
      <CouponManage
        coupons={JSON.parse(JSON.stringify(coupons))}
      ></CouponManage>
    </div>
  );
};

export default page;
