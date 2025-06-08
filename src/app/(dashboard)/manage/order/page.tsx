import OrderManage from "@/components/order/OrderManage";
import { getOrders } from "@/lib/actions/order.actions";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: {
    search: string;
    status: string;
    page: string;
  };
}) => {
  const orders = await getOrders({
    search: searchParams?.search || "",
    page: Number(searchParams?.page) || 1,
    status: searchParams?.status,
  });
  return (
    <div>
      <OrderManage orders={JSON.parse(JSON.stringify(orders))}></OrderManage>
    </div>
  );
};

export default page;
