import { getRatings } from "@/lib/actions/rating.action";
import React from "react";
import RatingManage from "./RatingManage";
import { ERatingStatus } from "@/types/enums";

const page = async ({
  searchParams,
}: {
  searchParams: {
    search: string;
    status: ERatingStatus;
    page: string;
  };
}) => {
  const ratings = await getRatings({
    search: searchParams?.search || "",
    status: searchParams?.status,
  });
  return (
    <div>
      <RatingManage ratings={ratings}></RatingManage>
    </div>
  );
};

export default page;
