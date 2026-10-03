import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional component classes with predictable Tailwind overrides. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
