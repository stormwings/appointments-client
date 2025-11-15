import {
  Appointment,
  AppointmentStatus,
  AppointmentsListResponse,
  CreateAppointmentPayload,
} from './appointments';
import type { TypedRequestInit } from './types';
import { API_CONFIG } from './constants';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseError(res: Response): Promise<never> {
  let message = `Error ${res.status}`;
  try {
    const clone = res.clone();
    const data = await clone.json();
    if (data?.message) {
      message = Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message;
    } else if (data) {
      message = typeof data === 'string' ? data : JSON.stringify(data);
    }
  } catch {
    try {
      const text = await res.text();
      if (text) message = text.slice(0, 200);
    } catch {
    }
  }
  throw new ApiError(message, res.status);
}

/**
 * Gets the appropriate API base URL based on environment
 * @returns The API base URL
 */
function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return process.env.NEXT_PUBLIC_INTERNAL_API_URL || 'http://localhost:3000/api';
}

/**
 * Generic request function with type-safe response
 * @template T - Expected response type
 * @param path - API path (relative to base URL)
 * @param init - Request options with optional timeout
 * @returns Promise resolving to typed response
 * @throws {ApiError} When response is not ok
 * @throws {Error} When connection fails
 */
async function request<T>(
  path: string,
  init?: TypedRequestInit,
): Promise<T> {
  const controller = new AbortController();
  const timeout: number = init?.timeoutMs ?? API_CONFIG.DEFAULT_TIMEOUT_MS;
  const id: NodeJS.Timeout = setTimeout(() => controller.abort(), timeout);
  const apiBaseUrl: string = getApiBaseUrl();
  try {
    const res = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      cache: init?.cache ?? 'no-store',
      headers: {
        Accept: 'application/json',
        ...(init?.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(id);

    if (!res.ok) {
      await parseError(res);
    }

    try {
      return (await res.json()) as T;
    } catch {
      return undefined as unknown as T;
    }
  } catch {
    clearTimeout(id);
    throw new Error('No se pudo conectar con la API. Intenta nuevamente.');
  }
}

/**
 * API client for appointments endpoints
 */
export const appointmentsApi = {
  /**
   * Get all appointments with optional filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to paginated list of appointments
   */
  async getAll(params: {
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<AppointmentsListResponse> {
    const search = new URLSearchParams();
    if (params.status) search.set('status', String(params.status).trim());
    if (typeof params.page === 'number')
      search.set('page', String(Math.max(1, Math.trunc(params.page))));
    if (typeof params.pageSize === 'number')
      search.set(
        'pageSize',
        String(Math.max(1, Math.min(100, Math.trunc(params.pageSize)))),
      );

    const qs = search.toString();
    return request<AppointmentsListResponse>(
      `/appointments${qs ? `?${qs}` : ''}`,
    );
  },

  /**
   * Get appointment by ID
   * @param id - Appointment ID
   * @returns Promise resolving to appointment details
   */
  async getById(id: string): Promise<Appointment> {
    return request<Appointment>(`/appointments/${id}`);
  },

  /**
   * Create a new appointment
   * @param payload - Appointment data
   * @returns Promise resolving to created appointment
   */
  async create(payload: CreateAppointmentPayload): Promise<Appointment> {
    return request<Appointment>(`/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update appointment status
   * @param id - Appointment ID
   * @param status - New status
   * @returns Promise resolving to updated appointment
   */
  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    return request<Appointment>(`/appointments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Cancel an appointment
   * @param id - Appointment ID
   * @returns Promise resolving when appointment is cancelled
   */
  async cancel(id: string): Promise<void> {
    await request<void>(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },
};
