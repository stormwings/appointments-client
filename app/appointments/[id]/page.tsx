import Link from 'next/link';
import { notFound } from 'next/navigation';
import { appointmentsApi, ApiError } from '@/lib/api';
import { Appointment, formatDateTime } from '@/lib/appointments';
import StatusBadge from '@/components/StatusBadge';
import StatusActions from '@/components/StatusActions';

export default async function AppointmentDetailPage(
  props: PageProps<'/appointments/[id]'>
) {
  const { id } = await props.params;

  if (!id) {
    notFound();
  }

  let appointment: Appointment | null = null;
  let error: string | null = null;

  try {
    appointment = await appointmentsApi.getById(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }

    error =
      err instanceof Error
        ? err.message
        : 'Error al cargar la cita. Verifica que la API esté disponible.';
  }

  const hasData = !error && !!appointment;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 font-sans">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.12)] ring-1 ring-slate-100">
          <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-8 pb-5 pt-6">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-400">
                CITA
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                Detalle de cita
              </h1>
              {appointment && (
                <p className="mt-1 text-xs text-slate-400">
                  ID:{' '}
                  <span className="font-mono text-[11px] text-slate-500">
                    {appointment.id}
                  </span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {appointment && <StatusBadge status={appointment.status} />}
              <Link
                href="/"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                <span className="text-slate-400">←</span>
                Listado
              </Link>
            </div>
          </header>

          <main className="px-8 pb-8 pt-6">
            {error && (
              <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                <p className="font-semibold mb-1">
                  No se pudo cargar la cita
                </p>
                <p>{error}</p>
              </div>
            )}

            {!error && !appointment && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-6 text-sm text-slate-600">
                Cargando cita...
              </div>
            )}

            {hasData && appointment && (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                <section className="space-y-6">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Resumen
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      {appointment.description || 'Cita sin descripción'}
                    </h2>
                    {appointment.comment && (
                      <p className="mt-2 text-sm text-slate-500">
                        {appointment.comment}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Detalles
                    </p>
                    <dl className="mt-3 grid gap-x-6 gap-y-3 text-sm text-slate-700 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-semibold text-slate-500">
                          Inicio
                        </dt>
                        <dd className="mt-0.5">
                          {appointment.start
                            ? formatDateTime(appointment.start)
                            : 'No definido'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold text-slate-500">
                          Fin
                        </dt>
                        <dd className="mt-0.5">
                          {appointment.end
                            ? formatDateTime(appointment.end)
                            : 'No definido'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold text-slate-500">
                          Duración
                        </dt>
                        <dd className="mt-0.5">
                          {appointment.minutesDuration
                            ? `${appointment.minutesDuration} minutos`
                            : 'No especificada'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold text-slate-500">
                          Última actualización
                        </dt>
                        <dd className="mt-0.5">
                          {appointment.meta?.lastUpdated
                            ? formatDateTime(appointment.meta.lastUpdated)
                            : 'No disponible'}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Participantes
                      </p>
                    </div>
                    <ul className="mt-3 space-y-3 text-sm text-slate-700">
                      {appointment.participant.map((p, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2"
                        >
                          <div>
                            <div className="font-medium text-slate-900">
                              {p.actor?.display ||
                                p.actor?.reference ||
                                'Sin nombre'}
                            </div>
                            <div className="text-xs text-slate-500">
                              {p.actor?.type || 'Sin tipo'} · Estado:{' '}
                              {p.status}
                              {p.required ? ` · ${p.required}` : ''}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Estado de la cita
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Cambia el estado según el flujo real (propuesta, pendiente,
                      reservada, completada, etc.). Solo se permiten
                      transiciones válidas según las reglas FHIR.
                    </p>
                    <div className="mt-4">
                      <StatusActions
                        appointmentId={appointment.id}
                        currentStatus={appointment.status}
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
