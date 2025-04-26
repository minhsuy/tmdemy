"use client";
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
          ? "text-white bg-primary transition-all svg-animate"
          : "hover:text-primary hover:bg-primary hover:bg-opacity-10 transition-all"
      }`}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
