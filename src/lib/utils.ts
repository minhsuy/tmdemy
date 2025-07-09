import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (time: number) => {
  if (time < 60) {
    return `${time}p`;
  }
  const hour = Math.floor(time / 60);
  const minute = time % 60;
  return `${hour}h${minute}p`;
};
