/**
 * Common TypeScript utility types and interfaces for the application
 */

import { NextRequest, NextResponse } from 'next/server';
import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentPayload,
  AppointmentsListResponse,
} from './appointments';

/**
 * Generic type for Next.js page params
 */
export type PageParams<T extends Record<string, string | string[]>> = {
  params: Promise<T>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Type-safe page props for dynamic routes
 */
export type PageProps<TRoute extends string> =
  TRoute extends `/appointments/[id]`
    ? PageParams<{ id: string }>
    : TRoute extends `/appointments/new`
      ? PageParams<Record<string, never>>
      : PageParams<Record<string, string>>;

/**
 * API route handler context with typed params
 */
export type RouteContext<T extends Record<string, string>> = {
  params: Promise<T>;
};

/**
 * Generic API response wrapper
 */
export type ApiResponse<T = unknown> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
      status?: number;
    };

/**
 * Error response from API
 */
export interface ErrorResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

/**
 * Update status request payload
 */
export interface UpdateStatusPayload {
  status: AppointmentStatus;
}

/**
 * Query parameters for appointment list endpoint
 */
export interface AppointmentQueryParams {
  status?: string;
  page?: string;
  pageSize?: string;
}

/**
 * Parsed and validated query parameters for appointment list
 */
export interface ValidatedAppointmentQueryParams {
  status?: AppointmentStatus;
  page: number;
  pageSize: number;
}

/**
 * React form change event handler types
 */
export type InputChangeHandler = React.ChangeEvent<HTMLInputElement>;
export type TextAreaChangeHandler = React.ChangeEvent<HTMLTextAreaElement>;
export type SelectChangeHandler = React.ChangeEvent<HTMLSelectElement>;
export type FormChangeHandler =
  | InputChangeHandler
  | TextAreaChangeHandler
  | SelectChangeHandler;

/**
 * Generic form submit handler
 */
export type FormSubmitHandler = React.FormEvent<HTMLFormElement>;

/**
 * Component props with children
 */
export interface PropsWithChildren {
  children: React.ReactNode;
}

/**
 * Component props with optional className
 */
export interface PropsWithClassName {
  className?: string;
}

/**
 * Combined props with children and className
 */
export interface BaseComponentProps extends PropsWithChildren, PropsWithClassName {}

/**
 * Utility type to make all properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Utility type to make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Extract keys of type T that are of type U
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Async function return type helper
 */
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : never;

/**
 * Type-safe API fetch options
 */
export interface TypedRequestInit extends Omit<RequestInit, 'body'> {
  body?: string;
  timeoutMs?: number;
}

/**
 * API client method types
 */
export interface AppointmentsApiMethods {
  getAll: (params: {
    status?: string;
    page?: number;
    pageSize?: number;
  }) => Promise<AppointmentsListResponse>;
  getById: (id: string) => Promise<Appointment>;
  create: (payload: CreateAppointmentPayload) => Promise<Appointment>;
  updateStatus: (id: string, status: AppointmentStatus) => Promise<Appointment>;
  cancel: (id: string) => Promise<void>;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Component loading state
 */
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

/**
 * Form state with loading and error
 */
export interface FormState<T = Record<string, unknown>> extends LoadingState {
  values: T;
}

/**
 * Type guard to check if value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard to check if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Type guard to check if error is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Extract non-nullable values from array
 */
export function filterNonNullable<T>(array: (T | null | undefined)[]): T[] {
  return array.filter(isDefined);
}
