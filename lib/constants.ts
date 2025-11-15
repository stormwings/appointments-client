/**
 * Application constants with proper TypeScript typing
 */

/**
 * Default pagination settings
 */
export const PAGINATION_DEFAULTS = {
  /** Default page number */
  PAGE: 1,
  /** Default page size */
  PAGE_SIZE: 12,
  /** Minimum page size */
  MIN_PAGE_SIZE: 1,
  /** Maximum page size */
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  /** Default timeout in milliseconds */
  DEFAULT_TIMEOUT_MS: 15000,
  /** Maximum retries for failed requests */
  MAX_RETRIES: 3,
  /** Retry delay in milliseconds */
  RETRY_DELAY_MS: 1000,
} as const;

/**
 * Date and time formatting
 */
export const DATE_FORMAT_CONFIG = {
  /** Locale for date formatting */
  LOCALE: 'es-AR',
  /** Date style option */
  DATE_STYLE: 'short' as const,
  /** Time style option */
  TIME_STYLE: 'short' as const,
} as const;

/**
 * Form validation constraints
 */
export const FORM_CONSTRAINTS = {
  /** Maximum description length */
  MAX_DESCRIPTION_LENGTH: 500,
  /** Maximum comment length */
  MAX_COMMENT_LENGTH: 1000,
  /** Maximum name length */
  MAX_NAME_LENGTH: 200,
  /** Minimum duration in minutes */
  MIN_DURATION_MINUTES: 1,
  /** Maximum duration in minutes */
  MAX_DURATION_MINUTES: 480, // 8 hours
} as const;

/**
 * UI configuration constants
 */
export const UI_CONFIG = {
  /** Transition duration in milliseconds */
  TRANSITION_DURATION: 300,
  /** Debounce delay for search in milliseconds */
  SEARCH_DEBOUNCE_MS: 300,
  /** Maximum items to show in autocomplete */
  MAX_AUTOCOMPLETE_ITEMS: 10,
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Type for HTTP status codes
 */
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

/**
 * Environment variables with type safety
 */
export const ENV = {
  /** Backend API URL */
  BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://localhost:8000',
  /** Internal API URL for server-side requests */
  INTERNAL_API_URL: process.env.NEXT_PUBLIC_INTERNAL_API_URL || 'http://localhost:3000/api',
  /** Environment mode */
  NODE_ENV: process.env.NODE_ENV || 'development',
  /** Whether we're in production */
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  /** Whether we're in development */
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;
