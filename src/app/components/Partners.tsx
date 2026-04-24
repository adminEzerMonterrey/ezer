import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export function Partners() {
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const { data, error } = await supabase.from('partners').select('*');
        if (!error && data) {
          setPartners(data);
        }
      } catch (e) {
        console.error("Error fetching partners:", e);
      }
    };
    fetchPartners();
  }, []);

  return (
    <section
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #F3F4F6",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
      className="py-8 md:py-10"
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
            marginBottom: 22,
          }}
          className="uppercase"
        >
          Colaboradores y alianzas que confían en EZER
        </p>

        {/* Logos grid via db */}
        <div
          style={{
            borderRadius: 12,
            border: "1px solid #F3F4F6",
            backgroundColor: "#FAFAFA",
            padding: "32px 24px",
            display: "flex",
            flexWrap: "wrap",
            gap: "36px",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "160px"
          }}
        >
          {partners.length > 0 ? (
            partners.map((partner) => (
              <img
                key={partner.id}
                src={partner.logo_url}
                alt={`Logo de ${partner.name}`}
                title={partner.name}
                style={{
                  height: "120px",
                  maxWidth: "320px",
                  objectFit: "contain",
                  display: "block",
                  transition: "transform 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />
            ))
          ) : (
            <p style={{ color: "#9CA3AF", fontSize: 14 }}>Aún no hay organizaciones aliadas registradas.</p>
          )}
        </div>

        {/* Count badge */}
        <div className="flex justify-center mt-4">
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
              {partners.length > 0 ? `${partners.length}+ organizaciones aliadas` : "Organizaciones aliadas"}
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
