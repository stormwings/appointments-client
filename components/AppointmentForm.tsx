"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { appointmentsApi } from "@/lib/api";
import {
  AppointmentStatus,
  APPOINTMENT_STATUS_OPTIONS,
  CreateAppointmentPayload,
  ParticipantStatus,
  ParticipantRequired,
} from "@/lib/appointments";
import type { FormChangeHandler, FormSubmitHandler } from "@/lib/types";

interface FormState {
  description: string;
  status: AppointmentStatus;
  start: string;
  end: string;
  minutesDuration: string;
  comment: string;
  patientName: string;
  practitionerName: string;
}

const DEFAULT_FORM: FormState = {
  description: "",
  status: "proposed",
  start: "",
  end: "",
  minutesDuration: "",
  comment: "",
  patientName: "",
  practitionerName: "",
};

export default function AppointmentForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: FormChangeHandler) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormSubmitHandler) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const startDate = form.start ? new Date(form.start) : undefined;
      const endDate = form.end ? new Date(form.end) : undefined;

      if (startDate && endDate && endDate < startDate) {
        throw new Error("La hora de fin no puede ser anterior al inicio.");
      }

      const minutesDuration = form.minutesDuration
        ? Number(form.minutesDuration)
        : undefined;

      if (
        minutesDuration !== undefined &&
        (Number.isNaN(minutesDuration) || minutesDuration < 0)
      ) {
        throw new Error("La duración debe ser un número positivo.");
      }

      const start = startDate ? startDate.toISOString() : undefined;
      const end = endDate ? endDate.toISOString() : undefined;

      const patientName = form.patientName.trim() || "Paciente sin nombre";

      const payload: CreateAppointmentPayload = {
        status: form.status,
        description: form.description || undefined,
        start,
        end,
        minutesDuration,
        comment: form.comment || undefined,
        participant: [
          {
            actor: {
              type: "Patient",
              display: patientName,
            },
            status: "accepted" as ParticipantStatus,
            required: "required" as ParticipantRequired,
          },
          ...(form.practitionerName
            ? [
                {
                  actor: {
                    type: "Practitioner",
                    display: form.practitionerName.trim(),
                  },
                  status: "accepted" as ParticipantStatus,
                  required: "required" as ParticipantRequired,
                },
              ]
            : []),
        ],
      };

      const created = await appointmentsApi.create(payload);
      router.push(`/appointments/${created.id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al crear la cita. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "block w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7 rounded-[26px] border border-slate-100 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
    >
      {error && (
        <div className="mb-1 rounded-2xl border border-red-200 bg-red-50/80 px-3 py-2 text-xs text-red-800">
          {error}
        </div>
      )}

      <section className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Detalles de la cita
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-slate-700">
              Descripción
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className={inputBase}
              placeholder="Consulta general, chequeo anual..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-medium text-slate-700">
              Estado
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputBase}
            >
              {APPOINTMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Horario
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-slate-700">
              Inicio
            </label>
            <input
              type="datetime-local"
              name="start"
              value={form.start}
              onChange={handleChange}
              className={inputBase}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-medium text-slate-700">
              Fin
            </label>
            <input
              type="datetime-local"
              name="end"
              value={form.end}
              onChange={handleChange}
              className={inputBase}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-medium text-slate-700">
              Duración (min)
            </label>
            <input
              type="number"
              min={0}
              name="minutesDuration"
              value={form.minutesDuration}
              onChange={handleChange}
              className={inputBase}
              placeholder="30"
            />
          </div>
        </div>
      </section>

      <section className="space-y-1">
        <label className="text-[12px] font-medium text-slate-700">
          Comentarios
        </label>
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          className={inputBase + " resize-none"}
          rows={3}
          placeholder="Notas sobre la consulta..."
        />
      </section>

      <section className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Participantes
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-slate-700">
              Nombre del paciente (obligatorio)
            </label>
            <input
              type="text"
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              className={inputBase}
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-medium text-slate-700">
              Profesional (opcional)
            </label>
            <input
              type="text"
              name="practitionerName"
              value={form.practitionerName}
              onChange={handleChange}
              className={inputBase}
              placeholder="Dra. María García"
            />
          </div>
        </div>
      </section>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_14px_36px_rgba(37,99,235,0.7)] hover:from-[#1D4ED8] hover:to-[#4338CA] disabled:opacity-60"
        >
          {loading ? "Creando cita…" : "Crear cita"}
        </button>
      </div>
    </form>
  );
}
