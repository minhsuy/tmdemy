import { cn } from "@/lib/utils";
import React from "react";

const Heading = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <h1 className={cn("text-3xl font-bold", className)}>{children}</h1>;
};

export default Heading;
