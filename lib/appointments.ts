export type AppointmentStatus =
  | 'proposed'
  | 'pending'
  | 'booked'
  | 'arrived'
  | 'checked-in'
  | 'fulfilled'
  | 'cancelled'
  | 'noshow'
  | 'entered-in-error'
  | 'waitlist';

export type ParticipantStatus =
  | 'accepted'
  | 'declined'
  | 'tentative'
  | 'needs-action';

export type ParticipantRequired =
  | 'required'
  | 'optional'
  | 'information-only';

export interface AppointmentParticipantActor {
  reference?: string;
  type?: string;
  display?: string;
}

export interface AppointmentParticipant {
  actor?: AppointmentParticipantActor;
  status: ParticipantStatus;
  required?: ParticipantRequired;
}

export interface AppointmentMeta {
  versionId?: string;
  lastUpdated?: string;
}

export interface Appointment {
  id: string;
  resourceType: 'Appointment';
  meta?: AppointmentMeta;
  status: AppointmentStatus;
  description?: string;
  start?: string;
  end?: string;
  minutesDuration?: number;
  comment?: string;
  participant: AppointmentParticipant[];
}

export interface CreateAppointmentPayload {
  status: AppointmentStatus;
  description?: string;
  start?: string;
  end?: string;
  minutesDuration?: number;
  comment?: string;
  participant: AppointmentParticipant[];
}

export interface AppointmentsListResponse {
  data: Appointment[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  proposed: 'Propuesta',
  pending: 'Pendiente',
  booked: 'Reservada',
  arrived: 'Llegó',
  'checked-in': 'Registrada',
  fulfilled: 'Completada',
  cancelled: 'Cancelada',
  noshow: 'No se presentó',
  'entered-in-error': 'Error de carga',
  waitlist: 'Lista de espera',
};

export const APPOINTMENT_STATUS_OPTIONS = ([
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
] as AppointmentStatus[]).map((value) => ({
  value,
  label: APPOINTMENT_STATUS_LABELS[value],
}));

export const APPOINTMENT_STATUS_TRANSITIONS: Record<
  AppointmentStatus,
  AppointmentStatus[]
> = {
  proposed: ['pending', 'cancelled', 'entered-in-error'],
  pending: ['booked', 'cancelled', 'entered-in-error'],
  booked: ['arrived', 'checked-in', 'cancelled', 'noshow', 'entered-in-error'],
  arrived: ['fulfilled', 'cancelled', 'noshow', 'entered-in-error'],
  'checked-in': ['fulfilled', 'cancelled', 'noshow', 'entered-in-error'],
  waitlist: ['pending', 'cancelled', 'entered-in-error'],
  fulfilled: [],
  cancelled: [],
  noshow: [],
  'entered-in-error': [],
};

export const TERMINAL_APPOINTMENT_STATUSES: AppointmentStatus[] = [
  'fulfilled',
  'cancelled',
  'noshow',
  'entered-in-error',
];

const CANCELLABLE_STATUSES: AppointmentStatus[] = [
  'proposed',
  'pending',
  'booked',
  'waitlist',
  'checked-in',
];

export function canCancelAppointment(status: AppointmentStatus): boolean {
  return CANCELLABLE_STATUSES.includes(status);
}

export function formatDateTime(value?: string): string {
  if (!value) return 'No definido';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}
