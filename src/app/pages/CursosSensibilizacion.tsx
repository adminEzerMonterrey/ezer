export function CursosSensibilizacionPage() {
  return (
    <section
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F8FAFC" }}
    >
      <div style={{ textAlign: "center", maxWidth: 480, padding: "40px 24px" }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>📚</div>
        <h1 style={{ color: "#1A2E6C", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.2, marginBottom: 16 }}>
          Cursos de Sensibilización
        </h1>
        <p style={{ color: "#6B7280", fontSize: 16, lineHeight: 1.7 }}>
          Próximamente encontrarás aquí toda la información sobre nuestros cursos de sensibilización.
        </p>
      </div>
    </section>
  );
}
