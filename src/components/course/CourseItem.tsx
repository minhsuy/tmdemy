import { courseInfo } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CourseItem = () => {
  return (
    <div className="border rounded-lg p-4 bg-gray-100">
      <Link href="#" className="block h-[180px] relative">
        <Image
          src="https://plus.unsplash.com/premium_photo-1745482648087-94febea21bb5?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Course Image"
          width={300}
          height={200}
          className="w-full h-full object-cover rounded-lg"
          sizes="@media (min-width : 640px) 300px, 100vw"
        ></Image>
        <span className="inline-block px-3 py-1 bg-green-500 text-xs font-medium text-white rounded-full absolute top-5 right-5">
          New
        </span>
      </Link>

      <div className="pt-4">
        <h3 className="font-bold text-lg mb-5">
          Khóa học NextJS Pro - Xây dựng E-Learning hoàn chỉnh
        </h3>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {courseInfo &&
            courseInfo.map((item, index) => (
              <div className="flex items-center gap-2 " key={index}>
                {item.icon("size-4")}
                {item.title}
              </div>
            ))}
          <span className="font-semibold text-primary text-base ml-auto">
            700,000 VND
          </span>
        </div>
        <div className="flex items-center justify-between"></div>
        <Link
          href="#"
          className="flex items-center justify-center w-full mt-10 text-white font-semibold bg-primary rounded-lg h-12"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default CourseItem;
