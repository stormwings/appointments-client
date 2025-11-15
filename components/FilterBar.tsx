"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  APPOINTMENT_STATUS_OPTIONS,
  AppointmentStatus,
} from "@/lib/appointments";

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = (searchParams.get("status") || "") as
    | AppointmentStatus
    | "";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("status", value);
      params.set("page", "1");
    } else {
      params.delete("status");
      params.delete("page");
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const baseChip =
    "inline-flex items-center rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition whitespace-nowrap";

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-600 scrollbar-thin scrollbar-thumb-slate-200 md:flex-wrap md:overflow-visible">
      <button
        type="button"
        onClick={() => handleChange("")}
        className={
          !currentStatus
            ? `${baseChip} border-blue-600 bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.45)]`
            : `${baseChip} border-slate-200 bg-white text-slate-600 hover:bg-slate-50`
        }
      >
        All
      </button>

      <button
        type="button"
        onClick={() => handleChange("")}
        className={
          !currentStatus
            ? `${baseChip} border-blue-600 bg-blue-50 text-blue-700`
            : `${baseChip} border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100`
        }
      >
        Todas
      </button>

      {APPOINTMENT_STATUS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => handleChange(opt.value)}
          className={
            currentStatus === opt.value
              ? `${baseChip} border-blue-600 bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.45)]`
              : `${baseChip} border-slate-200 bg-white text-slate-600 hover:bg-slate-50`
          }
        >
          <span className="mr-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-[10px] text-blue-600">
            {opt.label.charAt(0)}
          </span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
