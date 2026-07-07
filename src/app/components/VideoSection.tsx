const YOUTUBE_VIDEO_ID = "3-Cjru9SVAo"; // Pega aquí el ID de tu video de YouTube (ej: "dQw4w9WgXcQ")

export function VideoSection() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #1A2E6C 0%, #0f1b40 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 10% 50%, rgba(245,194,0,0.08) 0%, transparent 40%), radial-gradient(circle at 90% 50%, rgba(232,64,28,0.08) 0%, transparent 40%)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2
            style={{
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              lineHeight: 1.2,
            }}
          >
            Conoce EZER en{" "}
            <span style={{ color: "#F5C200" }}>acción</span>
          </h2>
          <p style={{ color: "#93A3C8", marginTop: 12, fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: "12px auto 0" }}>
            Así es como conectamos empresas, voluntarios y asociaciones para generar un impacto real en la comunidad.
          </p>
        </div>

        {/* Video container */}
        <div
          style={{
            position: "relative",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.08)",
            aspectRatio: "16 / 9",
            background: "#0f1b40",
          }}
        >
          {YOUTUBE_VIDEO_ID ? (
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1&color=white`}
              title="EZER — Voluntariado Corporativo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          ) : (
            /* Placeholder mientras no hay video */
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                color: "rgba(255,255,255,0.3)",
              }}
            >
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="31" stroke="currentColor" strokeWidth="2" />
                <path d="M26 22l20 10-20 10V22z" fill="currentColor" />
              </svg>
              <p style={{ fontSize: 14, fontWeight: 600 }}>Video próximamente</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
