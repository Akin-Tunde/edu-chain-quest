// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BaseError } from "viem"; // --- ADD THIS IMPORT ---

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// --- ADD THIS FUNCTION ---
// This function safely navigates the potentially nested error object from wagmi/viem.
export const getErrorMessage = (error: any): string => {
    if (error instanceof BaseError) {
        // The `walk` function traverses the error chain to find the root cause.
        const rootCause = error.walk();
        return (rootCause as any).shortMessage || rootCause.message || "An unknown error occurred.";
    }
    return error.message || "An unknown error occurred.";
};
