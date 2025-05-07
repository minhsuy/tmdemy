import React from "react";
import Link from "next/link";
import { menuItems } from "@/constants";
import { ActiveLink } from "../common";
import { UserButton } from "@clerk/nextjs";
import { IMenuItem } from "@/types/type";
import { ModeToggle } from "../common/ModeToggle";
import { createUser } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { IconUsers } from "../icons";

const Sidebar = async () => {
  const { userId } = await auth();
  return (
    <div className="p-5 border-r border-r-gray-300 flex flex-col dark:bg-grayDarker dark:boder dark:border-grayDarker">
      <Link className="font-bold text-3xl inline-block mb-5" href="/">
        <span className="text-primary">TM</span>
        demy
      </Link>
      <ul className="flex flex-col gap-2">
        {menuItems &&
          menuItems.map((item) => (
            <MenuItem
              key={item.id}
              icon={item.icon}
              url={item.url}
              title={item.title}
            ></MenuItem>
          ))}
      </ul>
      <div className="mt-auto flex items-center justify-between ">
        <ModeToggle></ModeToggle>
        {!userId ? (
          <Link href={"/sign-in"}>
            <IconUsers className="size-9  p-1 rounded-lg bg-primary text-white"></IconUsers>{" "}
          </Link>
        ) : (
          <UserButton />
        )}
      </div>
    </div>
  );
};

const MenuItem = ({ icon, url, title }: IMenuItem) => {
  return (
    <li>
      <ActiveLink url={url}>
        {icon} {title}
      </ActiveLink>
    </li>
  );
};

export default Sidebar;
