import type { AppointmentStatus } from "@/lib/appointments";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  proposed: "Propuesta",
  pending: "Pendiente",
  booked: "Reservada",
  arrived: "Llegó",
  "checked-in": "Registrado",
  fulfilled: "Completada",
  cancelled: "Cancelada",
  noshow: "No asistió",
  "entered-in-error": "Error",
  waitlist: "Lista de espera",
};

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  proposed: "bg-blue-50/90 text-blue-700 border-blue-100",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  booked: "bg-sky-50 text-sky-700 border-sky-200",
  arrived: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "checked-in": "bg-emerald-50 text-emerald-700 border-emerald-200",
  fulfilled: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  noshow: "bg-rose-50 text-rose-700 border-rose-200",
  "entered-in-error": "bg-slate-100 text-slate-600 border-slate-200",
  waitlist: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

interface StatusBadgeProps {
  status: AppointmentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const label = STATUS_LABELS[status] ?? status;
  const style =
    STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold shadow-sm ${style}`}
    >
      {label}
    </span>
  );
}
