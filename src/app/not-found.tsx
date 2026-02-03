import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4" style={{ background: "var(--bg-cream)" }}>
      <div className="text-center max-w-md">
        <h1 className="font-serif text-[120px] sm:text-[180px] font-bold text-[var(--text-muted)] opacity-20 select-none mb-4" style={{ fontFamily: "var(--font-serif)", lineHeight: 1 }}>
          404
        </h1>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-4" style={{ fontFamily: "var(--font-serif)" }}>
          Página no encontrada
        </h2>
        <p className="font-sans text-base text-[var(--text-secondary)] mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-block font-sans text-base text-[var(--primary-terracotta)] hover:text-[var(--primary-terracotta-dark)] transition-colors duration-200 underline underline-offset-4 decoration-[var(--primary-terracotta)]/30 hover:decoration-[var(--primary-terracotta)]/60"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
