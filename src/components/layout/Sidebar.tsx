import React from "react";
import Link from "next/link";
import { menuItems } from "@/constants";
import { ActiveLink } from "../common";
import { UserButton } from "@clerk/nextjs";
import { IMenuItem } from "@/types/type";

const Sidebar = () => {
  return (
    <div className="p-5 border-r border-r-gray-300 flex flex-col ">
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
      <div className="mt-auto flex items-center justify-end">
        <UserButton />
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
