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
      <div className="flex lg:hidden absolute bottom-0 items-center justify-between w-full p-3">
        <ul className="flex gap-x-3">
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
        <div className="mt-auto flex items-center justify-end gap-x-3">
          <ModeToggle></ModeToggle>
          {!userId ? (
            <Link href={"/sign-in"}>
              <div className="flex items-center gap-2 bg-primary text-white rounded-md py-2 px-4">
                <IconUser className="size-7 bg-primary text-white"></IconUser>
                <span>Đăng nhập</span>
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
