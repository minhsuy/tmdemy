"use client";
import { IActiveLink } from "@/types/type";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const ActiveLink = ({ url, children }: IActiveLink) => {
  const pathname = usePathname();
  const isActive = pathname === url;
  return (
    <Link
      href={url}
      className={`p-3 rounded-md flex items-center gap-3  ${
        isActive
          ? "text-white bg-primary transition-all svg-animate dark:bg-grayDark  dark:bg-opacity-20"
          : "hover:text-primary hover:bg-primary hover:bg-opacity-10 transition-all dark:text-gray-400"
      }`}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
