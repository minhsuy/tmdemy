import { ModeToggle } from "@/components/common/ModeToggle";
import IconUser from "@/components/icons/IconUser";
import Sidebar, { MenuItem } from "@/components/layout/Sidebar";
import { menuItems } from "@/constants";
import { getUserInfo } from "@/lib/actions/user.action";
import { EUserRole } from "@/types/enums";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();
  let role = EUserRole.USER;

  if (userId) {
    const userInfo = await getUserInfo({ userId });
    role = userInfo?.role || EUserRole.USER;
  }

  return (
    <div className="wrapper lg:grid lg:grid-cols-[300px,minmax(0,1fr)] h-full min-h-screen relative">
      <Sidebar />
      <div className="flex items-center justify-center lg:hidden gap-x-2 bottom-0  w-full p-3  h-16 z-50 fixed bg-gray-200 rounded-md dark:bg-grayDarker">
        <ul className="flex bottom-0 left-0 w-full gap-2">
          {menuItems
            .filter((item) => {
              if (!item.roles) return true;
              return item.roles.includes(role);
            })
            .map((item, index) => (
              <MenuItem
                key={index}
                url={item.url}
                title={item.title}
                icon={item.icon}
                onlyIcon
              ></MenuItem>
            ))}
        </ul>
        <div className="fixed bottom-[10px] right-0">
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
