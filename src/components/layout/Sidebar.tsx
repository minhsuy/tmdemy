import React from "react";
import Link from "next/link";
import ActiveLink from "../common/ActiveLink";
import { menuItems } from "@/constants";

const Sidebar = () => {
  return (
    <div className="p-5 border-r border-r-gray-300">
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
