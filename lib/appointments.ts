import { DATE_FORMAT_CONFIG } from './constants';

/**
 * FHIR Appointment status types
 * @see https://www.hl7.org/fhir/valueset-appointmentstatus.html
 */
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

/**
 * Participant status for an appointment
 */
export type ParticipantStatus =
  | 'accepted'
  | 'declined'
  | 'tentative'
  | 'needs-action';

/**
 * Whether the participant is required for the appointment
 */
export type ParticipantRequired =
  | 'required'
  | 'optional'
  | 'information-only';

export interface Identifier {
  use?: 'usual' | 'official' | 'temp' | 'secondary' | 'old';
  type?: CodeableConcept;
  system?: string;
  value?: string;
  period?: Period;
  assigner?: Reference;
}

export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Coding {
  system?: string;
  version?: string;
  code?: string;
  display?: string;
  userSelected?: boolean;
}

export interface Reference {
  reference?: string;
  type?: string;
  identifier?: Identifier;
  display?: string;
}

export interface Period {
  start?: string;
  end?: string;
}

/**
 * Actor (patient, practitioner, etc.) participating in the appointment
 */
export interface AppointmentParticipantActor {
  reference?: string;
  type?: string;
  display?: string;
}

/**
 * Participant in an appointment
 */
export interface AppointmentParticipant {
  type?: CodeableConcept[];
  actor?: AppointmentParticipantActor;
  status: ParticipantStatus;
  required?: ParticipantRequired;
  period?: Period;
}

/**
 * Metadata about the appointment resource
 */
export interface AppointmentMeta {
  versionId?: string;
  lastUpdated?: string;
}

/**
 * FHIR Appointment resource
 */
export interface Appointment {
  id: string;
  resourceType: 'Appointment';
  meta?: AppointmentMeta;
  identifier?: Identifier[];
  status: AppointmentStatus;
  cancelationReason?: CodeableConcept;
  serviceCategory?: CodeableConcept[];
  serviceType?: CodeableConcept[];
  specialty?: CodeableConcept[];
  appointmentType?: CodeableConcept;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  priority?: number;
  description?: string;
  supportingInformation?: Reference[];
  start?: string;
  end?: string;
  minutesDuration?: number;
  slot?: Reference[];
  created?: string;
  comment?: string;
  patientInstruction?: string;
  basedOn?: Reference[];
  participant: AppointmentParticipant[];
  requestedPeriod?: Period[];
}

/**
 * Payload for creating a new appointment
 */
export interface CreateAppointmentPayload {
  identifier?: Identifier[];
  status: AppointmentStatus;
  cancelationReason?: CodeableConcept;
  serviceCategory?: CodeableConcept[];
  serviceType?: CodeableConcept[];
  specialty?: CodeableConcept[];
  appointmentType?: CodeableConcept;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  priority?: number;
  description?: string;
  supportingInformation?: Reference[];
  start?: string;
  end?: string;
  minutesDuration?: number;
  slot?: Reference[];
  created?: string;
  comment?: string;
  patientInstruction?: string;
  basedOn?: Reference[];
  participant: AppointmentParticipant[];
  requestedPeriod?: Period[];
}

/**
 * Paginated response for appointments list
 */
export interface AppointmentsListResponse {
  data: Appointment[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Human-readable labels for appointment statuses (Spanish)
 */
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

/**
 * Status options for use in select/dropdown components
 */
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

/**
 * Valid status transitions for appointments
 * Maps current status to allowed next statuses
 */
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

/**
 * Terminal appointment statuses that cannot be changed
 */
export const TERMINAL_APPOINTMENT_STATUSES: AppointmentStatus[] = [
  'fulfilled',
  'cancelled',
  'noshow',
  'entered-in-error',
];

/**
 * Statuses that allow appointment cancellation
 */
const CANCELLABLE_STATUSES: AppointmentStatus[] = [
  'proposed',
  'pending',
  'booked',
  'waitlist',
  'checked-in',
];

/**
 * Checks if an appointment with the given status can be cancelled
 * @param status - Current appointment status
 * @returns True if appointment can be cancelled
 */
export function canCancelAppointment(status: AppointmentStatus): boolean {
  return CANCELLABLE_STATUSES.includes(status);
}

/**
 * Formats an ISO date string to a human-readable format (Spanish locale)
 * @param value - ISO date string
 * @returns Formatted date string or fallback text
 */
export function formatDateTime(value?: string): string {
  if (!value) return 'No definido';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(DATE_FORMAT_CONFIG.LOCALE, {
    dateStyle: DATE_FORMAT_CONFIG.DATE_STYLE,
    timeStyle: DATE_FORMAT_CONFIG.TIME_STYLE,
  }).format(date);
}
