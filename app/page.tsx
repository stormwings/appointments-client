import Link from "next/link";
import { appointmentsApi } from "@/lib/api";
import AppointmentCard from "@/components/AppointmentCard";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import type { AppointmentsListResponse } from "@/lib/appointments";

type HomeSearchParams = {
  status?: string;
  page?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams?: HomeSearchParams;
}) {
  const status = searchParams?.status ?? "";

  const rawPageStr = searchParams?.page ?? "1";
  const rawPage = parseInt(rawPageStr, 10);
  const page = !Number.isNaN(rawPage) && rawPage > 0 ? rawPage : 1;

  let appointments: AppointmentsListResponse | null = null;
  let error: string | null = null;

  try {
    appointments = await appointmentsApi.getAll({
      status: status || undefined,
      page,
      pageSize: 12,
    });
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Error al cargar las citas. Verifica que la API esté disponible.";
  }

  const hasData = appointments && appointments.data.length > 0;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 font-sans">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.12)] ring-1 ring-slate-100">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 pb-5 pt-6 sm:px-8">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-400">
                CITAS
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                Appointment
              </h1>
              <p className="mt-1 text-xs text-slate-500 max-w-md">
                Gestiona tus citas médicas, revisa estados y crea nuevas
                reservas fácilmente.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/appointments/new"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-[0_12px_32px_rgba(37,99,235,0.5)] transition hover:bg-blue-700 hover:shadow-[0_16px_40px_rgba(37,99,235,0.6)]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-base">
                  +
                </span>
                Nueva cita
              </Link>
            </div>
          </header>

          <main className="px-6 pb-7 pt-5 sm:px-8">
            <section>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Filtrar por estado
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Elige el estado para ver solo esas citas.
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <FilterBar />
              </div>
            </section>

            <section className="mt-5 space-y-6">
              {error && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                  <p className="font-semibold mb-1">
                    No se pudieron cargar las citas
                  </p>
                  <p>{error}</p>
                  <p className="mt-1 text-xs text-rose-700/80">
                    Asegúrate de que el backend esté corriendo en http://localhost:8000
                  </p>
                </div>
              )}

              {!error && !appointments && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-6 text-sm text-slate-600">
                  Cargando citas...
                </div>
              )}

              {!error && appointments && !hasData && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-6 py-10 text-center">
                  <svg
                    className="mx-auto h-10 w-10 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h2 className="mt-4 text-base font-semibold text-slate-900">
                    No hay citas
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {status
                      ? "No hay citas con el estado seleccionado."
                      : "Comienza creando una nueva cita."}
                  </p>
                  <Link
                    href="/appointments/new"
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-[0_12px_32px_rgba(37,99,235,0.5)] transition hover:bg-blue-700"
                  >
                    Crear primera cita
                  </Link>
                </div>
              )}

              {hasData && appointments && (
                <>
                  <div className="space-y-4">
                    {appointments.data.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                      />
                    ))}
                  </div>

                  <Pagination
                    currentPage={appointments.page}
                    totalPages={appointments.totalPages}
                    total={appointments.total}
                  />
                </>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
