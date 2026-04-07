const partnersImg = "https://placehold.co/1200x200/FAFAFA/9CA3AF?text=Logos+de+Organizaciones+Aliadas";

const PARTNER_NAMES = [
  "Fundación DeAcero",
  "Casa Hogar Padre Severiano Martínez",
  "Arco Iris de Jesús A.B.P.",
  "Hogar de la Misericordia",
  "Hogar San Vicente de Paul",
  "Fundación Ricardo, Andrés y José A. Chapa González A.C.",
  "Compartiendo Generosidad ABP",
  "Fomento Educativo",
  "Fundación Jesús M. Montemayor A.C.",
  "Cayam",
  "Fundación Promax",
  "Treviño Elizondo A.B.P.",
  "Nacional Monte de Piedad",
  "Casa Luis Reizo Elizondo",
  "NL Igualdad e Inclusión",
];

export function Partners() {
  return (
    <section
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #F3F4F6",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
      className="py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Label */}
        <p
          style={{
            color: "#9CA3AF",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textAlign: "center",
            marginBottom: 28,
          }}
          className="uppercase"
        >
          Colaboradores y alianzas que confían en EZER
        </p>

        {/* Logos grid via image */}
        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid #F3F4F6",
            backgroundColor: "#FAFAFA",
            padding: "20px 24px",
          }}
        >
          <img
            src={partnersImg}
            alt="Colaboradores y alianzas de EZER: Fundación DeAcero, Casa Hogar Padre Severiano Martínez, Arco Iris de Jesús, Hogar de la Misericordia, Fundación Chapa González, Compartiendo Generosidad ABP, Fomento Educativo, Fundación Jesús M. Montemayor, Cayam, Fundación Promax, Treviño Elizondo, Nacional Monte de Piedad, NL Igualdad e Inclusión y más."
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        {/* Count badge */}
        <div className="flex justify-center mt-5">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#F0F4FF",
              border: "1px solid #C7D2FE",
              borderRadius: 20,
              padding: "6px 16px",
            }}
          >
            <span style={{ fontSize: 16 }}>🤝</span>
            <span style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 13 }}>
              18+ organizaciones aliadas
            </span>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#E8401C",
                display: "inline-block",
                animation: "pulse 2s infinite",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}