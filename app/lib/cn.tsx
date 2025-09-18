import { twMerge } from "tailwind-merge"

import { ClassValue, clsx } from "clsx"

/**
 * Объединяет условные классы и предотвращает конфликты tailwind-стилей.
 * Используй вместо обычного className="..."
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
