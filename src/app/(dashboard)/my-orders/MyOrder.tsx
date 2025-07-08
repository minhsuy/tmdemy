"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { orderStatus } from "@/constants";

const MyOrder = ({ orders }: { orders: any[] }) => {
  console.log(orders);
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 ">
      <Separator />

      {orders.map((order: any) => (
        <Card key={order._id} className="border border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-bold">
                Mã đơn: {order.code}
              </p>
              <CardTitle className="text-base md:text-lg ">
                {order.course.title}
              </CardTitle>
            </div>
            <Badge
              variant={order.status === "THÀNH CÔNG" ? "default" : "outline"}
              className={
                orderStatus.find((item) => item.value === order.status)
                  ?.className
              }
            >
              {orderStatus.find((item) => item.value === order.status)?.title}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <p className="text-sm">
                Ngày đặt:{" "}
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </p>
              <p className="text-sm">
                Giá:{" "}
                <span className="font-semibold text-primary">
                  {order.total.toLocaleString()}₫
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MyOrder;
