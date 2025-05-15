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
      <ul className="flex p-3  border-t lg:hidden absolute  bottom-0 left-0 w-full justify-center gap-3 h-16 ">
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            url={item.url}
            title={item.title}
            icon={item.icon}
            onlyIcon={true}
          ></MenuItem>
        ))}
        <div className=" p-3 flex items-center justify-end   lg:hidden absolute  bottom-0 left-0 w-full  gap-3 h-16 ">
          {!userId ? (
            <Link href={"/sign-in"}>
              <div className="flex items-center gap-2 bg-primary text-white rounded-md py-2 px-4">
                <IconUser className="hidden size-7 bg-primary text-white"></IconUser>
                <span>Đăng nhập</span>
              </div>
            </Link>
          ) : (
            <UserButton />
          )}
        </div>
      </ul>
      <main className="p-5 dark:bg-grayDarkest">{children}</main>
    </div>
  );
};

export default layout;
