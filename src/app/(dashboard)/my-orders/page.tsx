import React from "react";
import MyOrder from "./MyOrder";
import Heading from "@/components/typography/Heading";
import { getMyOrder } from "@/lib/actions/order.actions";
import { auth } from "@clerk/nextjs/server";
import { getUserInfo } from "@/lib/actions/user.action";

const page = async () => {
  const { userId } = await auth();
  if (!userId) return;
  const user = await getUserInfo({ userId });
  const orders = await getMyOrder({ userId: user._id } as any);
  if (!orders) return null;
  return (
    <div className="mb-10">
      <Heading>Đơn hàng của tôi</Heading>
      <MyOrder orders={orders}></MyOrder>
    </div>
  );
};

export default page;
