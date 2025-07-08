"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Heading from "@/components/typography/Heading";
import React, { useState } from "react";
import { getCoupons } from "@/lib/actions/coupon.action";
import { ICoupon } from "@/database/coupon.model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const FreeCouponForm = ({ coupons }: { coupons: ICoupon[] }) => {
  const validCoupons = coupons.filter(
    (coupon) =>
      new Date() >= new Date(coupon.startDate) &&
      new Date() < new Date(coupon.endDate)
  );
  const [copiedCode, setCopiedCode] = useState("");

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      toast.success(`Đã sao chép mã "${code}"`);
    });
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {validCoupons.map((coupon) => (
          <Card key={coupon.code}>
            <CardHeader>
              <CardTitle>{coupon.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-wrap">
              <Input
                readOnly
                value={coupon.code}
                className="max-w-xs font-mono"
              />

              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Chọn khóa học" />
                </SelectTrigger>
                <SelectContent>
                  {coupon.courses.map((course: any) => (
                    <SelectItem
                      key={course._id}
                      value={course.title}
                      defaultValue={course.title}
                    >
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="text-white"
                onClick={() => handleCopy(coupon.code)}
              >
                {copiedCode === coupon.code ? "Đã sao chép" : "Sao chép"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FreeCouponForm;
