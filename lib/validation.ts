/**
 * Validation utilities for appointment data
 */

import type { AppointmentStatus } from './appointments';

/**
 * Validates if a string is a valid appointment status
 * @param value - String to validate
 * @returns True if value is a valid AppointmentStatus
 */
export function isValidAppointmentStatus(value: string): value is AppointmentStatus {
  const validStatuses: AppointmentStatus[] = [
    'proposed',
    'pending',
    'booked',
    'arrived',
    'checked-in',
    'fulfilled',
    'cancelled',
    'noshow',
    'entered-in-error',
    'waitlist',
  ];
  return validStatuses.includes(value as AppointmentStatus);
}

/**
 * Validates if a date string is in the future
 * @param dateString - ISO date string
 * @returns True if date is in the future
 */
export function isFutureDate(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    return date.getTime() > Date.now();
  } catch {
    return false;
  }
}

/**
 * Validates if a date string is valid
 * @param dateString - ISO date string
 * @returns True if date is valid
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !Number.isNaN(date.getTime());
}

/**
 * Validates if end date is after start date
 * @param start - Start date string
 * @param end - End date string
 * @returns True if end is after start
 */
export function isValidDateRange(start: string, end: string): boolean {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return endDate.getTime() > startDate.getTime();
  } catch {
    return false;
  }
}

/**
 * Validates if a page number is valid
 * @param page - Page number
 * @returns Validated page number (minimum 1)
 */
export function validatePageNumber(page: number | string | undefined): number {
  if (typeof page === 'string') {
    const parsed = parseInt(page, 10);
    return !Number.isNaN(parsed) && parsed > 0 ? parsed : 1;
  }
  return typeof page === 'number' && page > 0 ? Math.floor(page) : 1;
}

/**
 * Validates and constrains page size
 * @param pageSize - Requested page size
 * @param min - Minimum page size (default: 1)
 * @param max - Maximum page size (default: 100)
 * @returns Validated page size
 */
export function validatePageSize(
  pageSize: number | string | undefined,
  min = 1,
  max = 100
): number {
  if (typeof pageSize === 'string') {
    const parsed = parseInt(pageSize, 10);
    if (Number.isNaN(parsed)) return min;
    return Math.max(min, Math.min(max, Math.floor(parsed)));
  }
  if (typeof pageSize === 'number') {
    return Math.max(min, Math.min(max, Math.floor(pageSize)));
  }
  return min;
}

/**
 * Validates duration in minutes
 * @param duration - Duration value
 * @returns True if duration is valid (positive number)
 */
export function isValidDuration(duration: number | string | undefined): boolean {
  if (duration === undefined) return true;
  const num = typeof duration === 'string' ? parseFloat(duration) : duration;
  return !Number.isNaN(num) && num > 0;
}

/**
 * Sanitizes a string by trimming whitespace
 * @param value - String to sanitize
 * @returns Trimmed string or undefined if empty
 */
export function sanitizeString(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Validates and parses a number from string
 * @param value - Value to parse
 * @returns Parsed number or undefined if invalid
 */
export function parseOptionalNumber(value: string | undefined): number | undefined {
  if (!value || value.trim() === '') return undefined;
  const num = parseFloat(value);
  return !Number.isNaN(num) ? num : undefined;
}
