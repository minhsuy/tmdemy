import Link from "next/link";
import React from "react";

const CourseItem = () => {
  return (
    <div className="border rounded-lg p-4 bg-gray-200">
      <Link href="#" className="block">
        {/* <Image
          src="https://plus.unsplash.com/premium_photo-1745482648087-94febea21bb5?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Course Image"
          width={300}
          height={200}
        ></Image> */}
      </Link>
    </div>
  );
};

export default CourseItem;
