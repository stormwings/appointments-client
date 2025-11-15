import Link from "next/link";
import { Appointment, formatDateTime } from "@/lib/appointments";
import StatusBadge from "./StatusBadge";

interface Props {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment }: Props) {
  const patient = appointment.participant?.find(
    (p) => p.actor?.type === "Patient"
  );
  const practitioner = appointment.participant?.find(
    (p) => p.actor?.type === "Practitioner"
  );

  const patientName =
    patient?.actor?.display || patient?.actor?.reference || "Paciente";
  const initials =
    patientName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "PA";

  return (
    <Link
      href={`/appointments/${appointment.id}`}
      className="block rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-[1px] hover:shadow-[0_18px_45px_rgba(15,23,42,0.14)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.6)]">
          {initials}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Doctor
              </p>
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {practitioner?.actor?.display ||
                  practitioner?.actor?.reference ||
                  "Profesional asignado"}
              </h3>
              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                Paciente: {patientName}
              </p>
            </div>
            <StatusBadge status={appointment.status} />
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {appointment.start
                ? formatDateTime(appointment.start)
                : "No definido"}
            </span>
            {appointment.minutesDuration && (
              <span>{appointment.minutesDuration} min</span>
            )}
            <span className="ml-auto truncate font-mono text-[10px] text-slate-400">
              ID cita: {appointment.id}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
