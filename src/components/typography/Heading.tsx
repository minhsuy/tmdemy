"use client";
import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import IconArrowLeft from "../icons/IconArrowLeft";
import IconArrowRight from "../icons/IconArrowRight";
const Heading = ({
  children,
  className,
  search,
  page,
}: {
  children: React.ReactNode;
  className?: string;
  search?: boolean;
  page?: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  const handleSearchCourses = debounce((value: string) => {
    router.push(pathname + "?" + createQueryString("search", value));
  }, 700);
  const [pagination, setPagination] = useState(1);
  const handleChangePage = (action: "prev" | "next") => {
    if (action === "prev" && pagination === 1) return;
    if (action === "prev") setPagination(pagination - 1);
    else setPagination(pagination + 1);
  };
  useEffect(() => {
    router.push(
      pathname + "?" + createQueryString("page", Number(pagination).toString())
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);
  return (
    <div className="h-full">
      <div className="flex items-center justify-between">
        <h1 className={cn("text-3xl font-bold", className)}>{children}</h1>
        {search && (
          <div className="w-[300px]">
            <Input
              placeholder="Tìm kiếm khóa học..."
              onChange={(e) => handleSearchCourses(e.target.value)}
            />
          </div>
        )}
      </div>
      {page && (
        <div className="flex justify-end gap-3 mt-5">
          <button
            className="p-2  rounded-md hover dark:text-black  hover:text-white hover:bg-primary dark:hover:text-white dark:hover:bg-primary bg-slate-200"
            onClick={() => handleChangePage("prev")}
          >
            <IconArrowLeft className="size-7"></IconArrowLeft>
          </button>
          <button
            className="p-2  rounded-md hover dark:text-black hover:text-white hover:bg-primary bg-slate-200 dark:hover:text-white dark:hover:bg-primary"
            onClick={() => handleChangePage("next")}
          >
            <IconArrowRight className="size-7"></IconArrowRight>
          </button>
        </div>
      )}
    </div>
  );
};

export default Heading;
