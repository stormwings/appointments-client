import {
  Appointment,
  AppointmentStatus,
  AppointmentsListResponse,
  CreateAppointmentPayload,
} from './appointments';

export class ApiError extends Error {
  constructor(message: string, public status: number) {
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

function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return process.env.NEXT_PUBLIC_INTERNAL_API_URL || 'http://localhost:3000/api';
}

async function request<T>(
  path: string,
  init?: RequestInit & { timeoutMs?: number },
): Promise<T> {
  const controller = new AbortController();
  const timeout = init?.timeoutMs ?? 15000;
  const id = setTimeout(() => controller.abort(), timeout);
  const apiBaseUrl = getApiBaseUrl();
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

export const appointmentsApi = {
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

  async getById(id: string): Promise<Appointment> {
    return request<Appointment>(`/appointments/${id}`);
  },

  async create(payload: CreateAppointmentPayload): Promise<Appointment> {
    return request<Appointment>(`/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },

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

  async cancel(id: string): Promise<void> {
    await request<void>(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },
};
