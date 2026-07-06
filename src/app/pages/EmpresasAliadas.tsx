import { useEffect } from "react";
import { ClipboardEdit, Package, Users, Receipt, Gift, MapPin, FileImage, CheckCircle2, ArrowRight } from "lucide-react";

const INFO_CARDS = [
  { label: "Qué es", value: "Programa de donación en especie", icon: Package },
  { label: "Quién participa", value: "Empresas de cualquier giro y tamaño", icon: Users },
  { label: "Beneficio fiscal", value: "Recibo deducible (CFDI) · A.B.P.", icon: Receipt },
  { label: "Costo de registro", value: "Gratuito", icon: Gift },
  { label: "Destino", value: "Eventos de voluntariado y asociaciones aliadas", icon: MapPin },
  { label: "Evidencia", value: "Reporte de impacto con fotos", icon: FileImage },
];

const COMO_FUNCIONA = [
  "Donas producto de tu inventario, sin cuotas",
  "EZER coordina logística y entrega",
  "Recibes recibo deducible y reporte de impacto",
];

const LO_QUE_GANAS = [
  "Visibilidad de tu marca ante empresas y asociaciones",
  "Cumplimiento de objetivos de RSE, medible",
  "Deducibilidad fiscal de tu donativo",
];

const PRODUCTOS = [
  "Alimentos, despensa y bebidas",
  "Refrigerios e hidratación",
  "Papelería, arte y manualidades",
  "Libros y material educativo",
  "Juguetes, regalos y artículos de fiesta",
  "Ropa y calzado en buen estado",
  "Kits de higiene y autocuidado",
  "Mobiliario y utensilios de cocina",
  "Mobiliario escolar (pupitres, pizarrones)",
  "Cómputo, periféricos y tecnología",
  "Material deportivo",
  "Pintura, brochas y herramienta",
  "Plantas, semillas, tierra y riego",
  "Contenedores, básculas y señalización",
  "Material sensorial y adaptado",
  "Insumos y kits para emprendimiento",
  "Instrumentos y equipo de sonido",
  "Flores y detalles de celebración",
];

export function EmpresasAliadasPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://server.fillout.com/embed/v1/";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white">

      {/* HERO */}
      <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1A2E6C] to-[#0f1b40] overflow-hidden text-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#E8401C]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#F5C200]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Colabora con tus<br /><span className="text-[#F5C200]">productos</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-10">
            Convierte tu inventario en impacto social. Las Empresas Aliadas de EZER donan producto en especie que abastece los eventos de voluntariado corporativo: alimentos, material, mobiliario, herramienta y más. Tú donas lo que produces, nosotros lo llevamos a la asociación correcta y documentamos su destino con evidencia y recibo deducible.
          </p>
          <a
            href="#registro"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E8401C] text-white rounded-xl font-bold text-lg hover:brightness-110 active:scale-95 transition-all duration-200 shadow-xl shadow-red-900/30"
          >
            <ClipboardEdit size={20} />
            Quiero sumar a mi empresa
          </a>
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {INFO_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: 14,
                    padding: "20px 20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} style={{ color: "#E8401C", flexShrink: 0 }} />
                    <p style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                      {card.label}
                    </p>
                  </div>
                  <p style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 15, lineHeight: 1.35 }}>
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA + LO QUE GANAS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Cómo funciona */}
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#E8401C] mb-4">¿Cómo funciona?</h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Registras tu empresa y nos dices qué producto puedes donar. Cuando un evento de voluntariado necesita ese insumo, te contactamos, coordinamos la entrega y tu donación llega directo a quien la necesita.
            </p>
            <div className="flex flex-col gap-3">
              {COMO_FUNCIONA.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <ArrowRight size={16} style={{ color: "#E8401C", flexShrink: 0, marginTop: 3 }} />
                  <p className="text-gray-700 font-semibold text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lo que ganas */}
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A2E6C] mb-4">Lo que ganas como aliada</h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Tu marca se conecta con causas reales y con el sector privado que ya trabaja con EZER, con impacto medible y documentado.
            </p>
            <div className="flex flex-col gap-3">
              {LO_QUE_GANAS.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={16} style={{ color: "#1A2E6C", flexShrink: 0, marginTop: 3 }} />
                  <p className="text-gray-700 font-semibold text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* QUÉ PRODUCTO PUEDES DONAR */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A2E6C] mb-8">
            ¿Qué producto puedes donar?
          </h2>
          <div className="flex flex-wrap gap-3">
            {PRODUCTOS.map((p) => (
              <span
                key={p}
                style={{
                  border: "1.5px solid #1A2E6C",
                  borderRadius: 999,
                  padding: "8px 18px",
                  color: "#1A2E6C",
                  fontWeight: 700,
                  fontSize: 13,
                  backgroundColor: "#FFFFFF",
                  whiteSpace: "nowrap",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#1A2E6C]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              ¿Tu empresa quiere ser aliada?
            </h2>
            <p className="text-blue-200 text-base leading-relaxed max-w-lg">
              Regístrate y cuéntanos qué puedes donar. Nosotros te avisamos cuando haya un evento donde tu producto genere impacto, coordinamos la entrega y te entregamos tu recibo deducible y el reporte del destino de tu donación.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0 text-sm font-semibold text-[#F5C200]">
            <span>voluntariadocorporativo@ezer.org.mx</span>
            <span>ezer-eventos.vercel.app</span>
            <a
              href="#registro"
              className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E8401C] text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all duration-200 shadow-lg"
            >
              <ClipboardEdit size={16} />
              Registrar mi empresa
            </a>
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section id="registro" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl shadow-blue-900/10 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#F5C200] via-[#E8401C] to-[#1A2E6C]" />
            <div
              style={{ width: "100%", height: "800px" }}
              data-fillout-id="5oyXgmpgcrus"
              data-fillout-embed-type="standard"
              data-fillout-inherit-parameters
              data-fillout-dynamic-resize
            ></div>
          </div>
        </div>
      </section>

    </div>
  );
}
