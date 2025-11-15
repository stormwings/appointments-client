"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-gray-50">
        <main className="max-w-xl mx-auto px-4 py-16">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
            <h2 className="mb-2 text-lg font-semibold">Ocurrió un error inesperado</h2>
            <p className="text-sm mb-4">Intenta nuevamente o vuelve al inicio.</p>
            <div className="flex gap-3">
              <button
                onClick={() => reset()}
                className="rounded-md bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700"
              >
                Reintentar
              </button>
              <Link
                href="/"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Ir al inicio
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
