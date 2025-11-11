import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const phoneNumber = value.replace(/\D/g, '')

  // Format as (XXX) XXX-XXXX
  const match = phoneNumber.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)

  if (!match) return value

  const [, areaCode, prefix, lineNumber] = match

  if (lineNumber) {
    return `(${areaCode}) ${prefix}-${lineNumber}`
  } else if (prefix) {
    return `(${areaCode}) ${prefix}`
  } else if (areaCode) {
    return `(${areaCode}`
  }

  return ''
}
