"use client";

export default function ResetPlaceholder() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        background: "#f6f8fb",
        padding: 24,
        color: "#0f172a",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Inter, Roboto, "Helvetica Neue", Arial',
      }}
    >
      <section
        style={{
          width: "min(92vw, 520px)",
          background: "#fff",
          border: "1px solid #e5edf3",
          borderRadius: 16,
          boxShadow: "0 18px 45px rgba(13,28,39,.10)",
          padding: 24,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 6, fontSize: "1.25rem", fontWeight: 800 }}>
          Redefinição de senha
        </h1>
        <p style={{ marginTop: 0, marginBottom: 14, color: "#5b6b7b" }}>
          Esta funcionalidade será ativada em breve. Enquanto isso, você pode voltar ao login
          ou solicitar um novo link pelo “Esqueci minha senha”.
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          <a
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 48,
              borderRadius: 12,
              border: "1px solid #0d6d66",
              background: "linear-gradient(180deg,#0f766e,#0d6d66)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 800,
              letterSpacing: ".01em",
            }}
          >
            Voltar ao login
          </a>

          <a
            href="/forgot"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 48,
              borderRadius: 12,
              border: "1px solid #e5edf3",
              background: "#fff",
              color: "#0f172a",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Esqueci minha senha
          </a>
        </div>
      </section>
    </main>
  );
}
