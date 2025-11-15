"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_OPTIONS,
  APPOINTMENT_STATUS_TRANSITIONS,
  AppointmentStatus,
  canCancelAppointment,
} from "@/lib/appointments";
import { appointmentsApi } from "@/lib/api";

interface Props {
  appointmentId: string;
  currentStatus: AppointmentStatus;
}

export default function StatusActions({ appointmentId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<AppointmentStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allowedNext = APPOINTMENT_STATUS_TRANSITIONS[currentStatus] || [];

  const handleUpdateStatus = async () => {
    if (status === currentStatus) return;
    setLoading(true);
    setError(null);
    try {
      await appointmentsApi.updateStatus(appointmentId, status);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar el estado de la cita."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!canCancelAppointment(currentStatus)) return;

    const confirmCancel = window.confirm(
      "¿Seguro que deseas cancelar esta cita? Esta operación no se puede deshacer."
    );
    if (!confirmCancel) return;

    setLoading(true);
    setError(null);

    try {
      await appointmentsApi.cancel(appointmentId);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cancelar la cita. Verifica las reglas de negocio."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectBase =
    "block w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-[12px] shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition";

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50/90 px-3 py-2 text-[11px] text-red-800">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1 space-y-1">
          <label className="text-[12px] font-medium text-slate-700">
            Cambiar estado
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
            className={selectBase}
          >
            <option value={currentStatus}>
              {APPOINTMENT_STATUS_LABELS[currentStatus]} (actual)
            </option>
            {APPOINTMENT_STATUS_OPTIONS.filter((opt) =>
              allowedNext.includes(opt.value)
            ).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {APPOINTMENT_STATUS_LABELS[opt.value]}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          disabled={loading || status === currentStatus}
          onClick={handleUpdateStatus}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_14px_32px_rgba(37,99,235,0.7)] hover:from-[#1D4ED8] hover:to-[#4338CA] disabled:opacity-60"
        >
          {loading ? "Guardando…" : "Guardar estado"}
        </button>
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-3">
        <p className="text-[11px] text-slate-500">
          Estado actual:{" "}
          <span className="font-medium text-slate-700">
            {APPOINTMENT_STATUS_LABELS[currentStatus]}
          </span>
        </p>

        <button
          type="button"
          disabled={loading || !canCancelAppointment(currentStatus)}
          onClick={handleCancel}
          className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-50"
        >
          Cancelar cita
        </button>
      </div>
    </div>
  );
}
