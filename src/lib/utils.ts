import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { vnd } from "./domain";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { vnd, vnd as formatVND };
