import Link from 'next/link';
import AppointmentForm from '@/components/AppointmentForm';

export default function NewAppointmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E7EEFF] via-[#F4F6FB] to-[#F4F6FB] px-4 py-10">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.15)] ring-1 ring-slate-100">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 pb-5 pt-6 sm:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Cita
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Nueva cita médica
            </h1>
            <p className="mt-1 max-w-md text-xs text-slate-500">
              Completa los datos para crear una nueva cita en el sistema.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-blue-600 shadow-sm hover:bg-slate-100"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-xs text-blue-500">
              ←
            </span>
            <span>Listado</span>
          </Link>
        </header>

        <main className="px-6 pb-7 pt-5 sm:px-8">
          <AppointmentForm />
        </main>
      </div>
    </div>
  );
}
