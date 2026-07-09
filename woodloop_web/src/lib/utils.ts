import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safe date formatting — never throws on invalid input.
 * Returns "-" untuk null/undefined/invalid date.
 */
export function formatDate(
  iso: string | undefined | null,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      ...options,
    }).format(d);
  } catch {
    return "-";
  }
}
