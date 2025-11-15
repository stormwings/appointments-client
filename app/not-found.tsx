import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-xl mx-auto px-4 py-16">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Página no encontrada
          </h2>
          <p className="mt-2 text-gray-600">
            La ruta solicitada no existe o fue movida.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
