"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { PaginationMeta } from "@/lib/types";

interface PaginationProps extends PaginationMeta {}

export default function Pagination({ currentPage, totalPages, total }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const changePage = (page: number): void => {
    const next = Math.max(1, Math.min(totalPages, page));
    if (next === currentPage) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(next));
    const query = params.toString();
    router.push(`${pathname}?${query}`);
  };

  const baseBtn =
    "inline-flex h-8 items-center justify-center rounded-full px-3 text-xs font-semibold transition";

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 text-[11px] text-slate-500 sm:flex-row">
      <p>
        Página{" "}
        <span className="font-semibold text-slate-700">{currentPage}</span> de{" "}
        <span className="font-semibold text-slate-700">{totalPages}</span> ·{" "}
        <span className="font-semibold text-slate-700">{total}</span> citas
      </p>

      <div className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-1 py-1 shadow-inner">
        <button
          type="button"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`${baseBtn} border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40`}
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`${baseBtn} border border-blue-600 bg-blue-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.45)] hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
