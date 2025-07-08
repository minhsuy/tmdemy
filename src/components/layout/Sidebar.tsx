import React, { use } from "react";
import Link from "next/link";
import { menuItems } from "@/constants";
import { ActiveLink } from "../common";
import { UserButton } from "@clerk/nextjs";
import { IMenuItem } from "@/types/type";
import { ModeToggle } from "../common/ModeToggle";
import { createUser, getUserInfo } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { IconUsers } from "../icons";
import IconUser from "../icons/IconUser";
import { EUserRole } from "@/types/enums";

const Sidebar = async () => {
  const { userId } = await auth();
  let role = EUserRole.USER;

  if (userId) {
    const userInfo = await getUserInfo({ userId });
    role = userInfo?.role || EUserRole.USER;
  }

  return (
    <div className="hidden p-5 border-r border-r-gray-300 lg:flex flex-col dark:bg-grayDarker dark:boder dark:border-grayDarker">
      <Link className="font-bold text-3xl inline-block mb-5" href="/">
        <span className="text-primary">TM</span>
        demy
      </Link>
      <ul className="flex flex-col gap-2">
        {menuItems
          .filter((item) => {
            if (!item.roles) return true;
            return item.roles.includes(role);
          })
          .map((item) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              url={item.url}
              title={item.title}
            />
          ))}
      </ul>
      <div className="mt-auto flex items-center justify-between ">
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
  );
};

export function MenuItem({ url = "/", title = "", icon, onlyIcon }: IMenuItem) {
  return (
    <li>
      <ActiveLink url={url}>
        {icon}
        {onlyIcon ? null : title}
      </ActiveLink>
    </li>
  );
}

export default Sidebar;
