import { ModeToggle } from "@/components/common/ModeToggle";
import IconUser from "@/components/icons/IconUser";
import Sidebar, { MenuItem } from "@/components/layout/Sidebar";
import { menuItems } from "@/constants";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();
  return (
    <div className="wrapper lg:grid lg:grid-cols-[300px,minmax(0,1fr)] h-full min-h-screen relative">
      <Sidebar />
      <div className="flex lg:hidden gap-3 absolute bottom-0 items-center justify-center w-full p-3">
        <ul className="flex gap-x-2">
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              url={item.url}
              title={item.title}
              icon={item.icon}
              onlyIcon
            ></MenuItem>
          ))}
        </ul>
        <div className="flex items-center justify-center">
          {!userId ? (
            <Link href={"/sign-in"}>
              <div className="flex items-center gap-2 bg-primary text-white rounded-md p-2">
                <IconUser className="size-7 bg-primary text-white"></IconUser>
                <span className="hidden">Đăng nhập</span>
              </div>
            </Link>
          ) : (
            <UserButton />
          )}
        </div>
      </div>

      <main className="p-5 dark:bg-grayDarkest">{children}</main>
    </div>
  );
};

export default layout;
