import { useState, useRef, useCallback } from "react";
import { Send, CheckCircle, Building, Mail, Phone, Download, FileText, ArrowRight, Upload, X, Paperclip } from "lucide-react";
import { supabase } from "../../supabaseClient";

const emptyForm = {
  org: "",
  email: "",
  phone: "",
};

export function CollaborationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (file: File) => {
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (allowed.includes(file.type) || file.name.match(/\.(pdf|doc|docx)$/i)) {
      setAttachedFile(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      // 1. Guardar en Supabase
      const { error: dbError } = await supabase
        .from('collaboration_requests')
        .insert([{
          organization: form.org,
          email: form.email,
          phone: form.phone || null,
          has_file: !!attachedFile,
          file_name: attachedFile?.name || null,
        }]);

      if (dbError) {
        console.error('Error saving to Supabase:', dbError);
      }

      // 2. Enviar correo vía API
      try {
        await fetch('/api/collaboration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            org: form.org,
            email: form.email,
            phone: form.phone,
            hasFile: !!attachedFile,
            fileName: attachedFile?.name || null,
          })
        });
      } catch (emailErr) {
        console.error('Email API failed (data saved to DB):', emailErr);
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError("Hubo un error al enviar. Intenta de nuevo.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section
      id="contacto"
      className="py-16 md:py-24"
      style={{ backgroundColor: "#F5F5F5", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            style={{ color: "#1A2E6C", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", lineHeight: 1.2, marginTop: 8 }}
          >
            ¿Quieres colaborar con EZER?
          </h2>
          <p style={{ color: "#6B7280", marginTop: 12, maxWidth: 560 }} className="mx-auto text-base">
            Regístra tu interés y descarga el formato oficial para enviarnos los detalles de tu evento.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-5xl mx-auto">
          {/* Left: Illustration + Why cards */}
          <div className="flex flex-col gap-6">
            <CollaborationIllustration />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: "🤝", title: "Impacto medible", desc: "Reportes de impacto social para tu empresa." },
                { icon: "🏆", title: "Reconocimiento", desc: "Visibilidad en nuestra red de aliados." },
                { icon: "💡", title: "Innovación social", desc: "Co-crea soluciones con las ONGs." },
                { icon: "🌱", title: "Sostenibilidad", desc: "Contribuye a los ODS de la ONU." },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    padding: "16px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: "#6B7280", fontSize: 12, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: "clamp(24px, 4vw, 36px)",
              boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
              border: "1px solid #E5E7EB",
            }}
          >
            {submitted ? (
              <SuccessState
                hasFile={!!attachedFile}
                fileName={attachedFile?.name}
                onReset={() => { setSubmitted(false); setForm(emptyForm); setAttachedFile(null); }}
              />
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* ── Sección 1: Datos de contacto ── */}
                <SectionHeader number="1" title="Datos de contacto" />

                <FormField icon={<Building size={15} style={{ color: "#9CA3AF" }} />} label="Nombre de la organización" required>
                  <input
                    name="org"
                    type="text"
                    value={form.org}
                    onChange={handleChange}
                    placeholder="Ej: Fundación Esperanza"
                    required
                    style={inputStyle}
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField icon={<Mail size={15} style={{ color: "#9CA3AF" }} />} label="Correo electrónico" required>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="correo@empresa.com"
                      required
                      style={inputStyle}
                    />
                  </FormField>
                  <FormField icon={<Phone size={15} style={{ color: "#9CA3AF" }} />} label="Teléfono">
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+52 55 1234 5678"
                      style={inputStyle}
                    />
                  </FormField>
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1.5px dashed #E5E7EB", margin: "4px 0" }} />

                {/* ── Sección 2: Formato del evento ── */}
                <SectionHeader number="2" title="Formato del evento" />

                {/* Download card */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #EEF2FF 0%, #F0F9FF 100%)",
                    border: "1.5px solid #C7D2FE",
                    borderRadius: 12,
                    padding: "20px",
                  }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      style={{
                        width: 48,
                        height: 56,
                        backgroundColor: "#FFFFFF",
                        borderRadius: 8,
                        border: "1.5px solid #C7D2FE",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(26,46,108,0.08)",
                        gap: 4,
                      }}
                    >
                      <FileText size={20} style={{ color: "#1A2E6C" }} />
                      <span style={{ fontSize: 9, color: "#E8401C", fontWeight: 800, letterSpacing: "0.05em" }}>DOCX</span>
                    </div>
                    <div>
                      <p style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 14, marginBottom: 3 }}>
                        Formato de solicitud de evento
                      </p>
                      <p style={{ color: "#6B7280", fontSize: 12, lineHeight: 1.5 }}>
                        Descarga, llena con los datos de tu evento y adjúntalo en la sección 3.
                      </p>
                    </div>
                  </div>
                  {/* ⚠️ Reemplaza el href con el enlace real al documento cuando esté disponible */}
                  <a
                    href="#"
                    download
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      backgroundColor: "#1A2E6C",
                      color: "#FFFFFF",
                      borderRadius: 8,
                      padding: "11px 18px",
                      fontWeight: 700,
                      fontSize: 13,
                      textDecoration: "none",
                      transition: "all 0.2s",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#243d8a")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#1A2E6C")}
                  >
                    <Download size={15} />
                    Descargar formato
                  </a>
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1.5px dashed #E5E7EB", margin: "4px 0" }} />

                {/* ── Sección 3: Adjuntar documento ── */}
                <SectionHeader number="3" title="Adjuntar formato lleno" />

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />

                {/* Drop zone / file preview */}
                {attachedFile ? (
                  /* ── File attached state ── */
                  <div
                    style={{
                      border: "1.5px solid #BBF7D0",
                      borderRadius: 12,
                      backgroundColor: "#F0FDF4",
                      padding: "16px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 46,
                        backgroundColor: "#FFFFFF",
                        borderRadius: 8,
                        border: "1.5px solid #BBF7D0",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        gap: 3,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      }}
                    >
                      <Paperclip size={16} style={{ color: "#16A34A" }} />
                      <span style={{ fontSize: 8, color: "#16A34A", fontWeight: 800, letterSpacing: "0.04em" }}>
                        {attachedFile.name.split(".").pop()?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        style={{ color: "#15803D", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {attachedFile.name}
                      </p>
                      <p style={{ color: "#6B7280", fontSize: 11, marginTop: 2 }}>
                        {formatSize(attachedFile.size)} · Listo para enviar
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setAttachedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: "none",
                        backgroundColor: "#FEE2E2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                      title="Eliminar archivo"
                    >
                      <X size={13} style={{ color: "#DC2626" }} />
                    </button>
                  </div>
                ) : (
                  /* ── Drop zone ── */
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${dragOver ? "#1A2E6C" : "#D1D5DB"}`,
                      borderRadius: 12,
                      backgroundColor: dragOver ? "#EEF2FF" : "#FAFAFA",
                      padding: "28px 20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: dragOver ? "#C7D2FE" : "#EEF2FF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.2s",
                      }}
                    >
                      <Upload size={22} style={{ color: "#1A2E6C" }} />
                    </div>
                    <div className="text-center">
                      <p style={{ color: "#1A2E6C", fontWeight: 700, fontSize: 13 }}>
                        {dragOver ? "Suelta el archivo aquí" : "Arrastra tu archivo o haz clic"}
                      </p>
                      <p style={{ color: "#9CA3AF", fontSize: 11, marginTop: 3 }}>
                        PDF, DOC o DOCX · Máx. 10 MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: "1.5px solid #D1D5DB",
                        borderRadius: 8,
                        padding: "8px 16px",
                        color: "#374151",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "border-color 0.2s",
                      }}
                    >
                      <Paperclip size={13} />
                      Seleccionar archivo
                    </button>
                  </div>
                )}

                {/* Alternative: send by email */}
                <div
                  style={{
                    backgroundColor: "#FFFBEB",
                    border: "1.5px solid #FDE68A",
                    borderRadius: 12,
                    padding: "14px 16px",
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Mail size={14} style={{ color: "#92400E", flexShrink: 0 }} />
                  <p style={{ color: "#92400E", fontSize: 12, lineHeight: 1.5 }}>
                    También puedes enviarlo directamente a{" "}
                    <a href="mailto:info@ezer.org.mx" style={{ color: "#E8401C", fontWeight: 700, textDecoration: "none" }}>
                      info@ezer.org.mx
                    </a>
                  </p>
                </div>

                {submitError && (
                  <p style={{ color: '#E8401C', fontSize: 13, textAlign: 'center' }}>{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: "#F5C200",
                    color: "#1A2E6C",
                    borderRadius: 8,
                    border: "none",
                    padding: "14px 24px",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: submitting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s",
                    boxShadow: "0 4px 16px rgba(245,194,0,0.4)",
                    marginTop: 4,
                    opacity: submitting ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.05)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)")}
                >
                  <Send size={17} />
                  {submitting ? "Enviando..." : attachedFile ? "Enviar solicitud con documento" : "Enviar solicitud de contacto"}
                </button>

                <p style={{ color: "#9CA3AF", fontSize: 12, textAlign: "center", marginTop: -4 }}>
                  Al enviar, aceptas nuestra{" "}
                  <a href="#" style={{ color: "#1A2E6C" }} className="underline">política de privacidad</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid #E5E7EB",
  borderRadius: 8,
  padding: "11px 14px",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontWeight: 400,
  fontSize: 14,
  color: "#2C2C2A",
  backgroundColor: "#FAFAFA",
  outline: "none",
  transition: "border-color 0.2s",
};

function FormField({
  label,
  required,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ color: "#2C2C2A", fontWeight: 600, fontSize: 13 }}>
        {icon && <span className="inline-flex mr-1.5 align-middle">{icon}</span>}
        {label}
        {required && <span style={{ color: "#E8401C", marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function SuccessState({ hasFile, fileName, onReset }: { hasFile: boolean; fileName?: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
      <div
        style={{ width: 72, height: 72, borderRadius: "50%", backgroundColor: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <CheckCircle size={38} style={{ color: "#16A34A" }} />
      </div>
      <h3 style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 22 }}>¡Solicitud enviada!</h3>
      <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6, maxWidth: 320 }}>
        Gracias por tu interés en colaborar con EZER.{" "}
        {hasFile && fileName ? (
          <>El documento <strong style={{ color: "#1A2E6C" }}>{fileName}</strong> fue adjuntado correctamente. </>
        ) : null}
        Nuestro equipo te contactará en las próximas <strong>48 horas</strong>.
      </p>
      <button
        onClick={onReset}
        style={{
          backgroundColor: "#F5C200",
          color: "#1A2E6C",
          borderRadius: 8,
          border: "none",
          padding: "12px 24px",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          marginTop: 8,
        }}
      >
        Enviar otra solicitud
      </button>
    </div>
  );
}

function CollaborationIllustration() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1A2E6C 0%, #2B4AA8 100%)",
        borderRadius: 16,
        padding: "32px 28px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative stars */}
      {[
        { x: "8%", y: "12%", s: 16 },
        { x: "88%", y: "8%", s: 12 },
        { x: "92%", y: "75%", s: 10 },
        { x: "5%", y: "80%", s: 14 },
      ].map((s, i) => (
        <div key={i} style={{ position: "absolute", left: s.x, top: s.y, opacity: 0.5 }}>
          <svg width={s.s} height={s.s} viewBox="0 0 20 20">
            <path d="M10 2 L11.5 7.5 L17 7.5 L12.5 11 L14 16.5 L10 13.5 L6 16.5 L7.5 11 L3 7.5 L8.5 7.5 Z" fill="#F5C200" />
          </svg>
        </div>
      ))}

      {/* SVG Illustration */}
      <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm mx-auto">
        {/* Ground */}
        <ellipse cx="160" cy="185" rx="120" ry="10" fill="rgba(255,255,255,0.05)" />

        {/* Person 1 (left) */}
        <circle cx="80" cy="90" r="18" fill="#E8401C" />
        <path d="M60 135 Q60 115 80 112 Q100 115 100 135 L100 165 Q100 170 95 170 L65 170 Q60 170 60 165 Z" fill="#E8401C" opacity="0.9" />
        <line x1="60" y1="130" x2="45" y2="148" stroke="#E8401C" strokeWidth="8" strokeLinecap="round" />
        <line x1="100" y1="130" x2="118" y2="142" stroke="#E8401C" strokeWidth="8" strokeLinecap="round" />

        {/* Person 2 (center) */}
        <circle cx="160" cy="80" r="22" fill="#F5C200" />
        <path d="M136 132 Q136 110 160 106 Q184 110 184 132 L184 168 Q184 174 178 174 L142 174 Q136 174 136 168 Z" fill="#F5C200" opacity="0.9" />
        <line x1="136" y1="126" x2="118" y2="142" stroke="#F5C200" strokeWidth="9" strokeLinecap="round" />
        <line x1="184" y1="126" x2="202" y2="138" stroke="#F5C200" strokeWidth="9" strokeLinecap="round" />

        {/* Person 3 (right) */}
        <circle cx="240" cy="90" r="18" fill="#E8401C" opacity="0.8" />
        <path d="M220 135 Q220 115 240 112 Q260 115 260 135 L260 165 Q260 170 255 170 L225 170 Q220 170 220 165 Z" fill="#E8401C" opacity="0.7" />
        <line x1="260" y1="130" x2="275" y2="148" stroke="#E8401C" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
        <line x1="220" y1="130" x2="202" y2="138" stroke="#E8401C" strokeWidth="8" strokeLinecap="round" opacity="0.8" />

        {/* Heart */}
        <path d="M150 50 Q150 40 160 42 Q170 40 170 50 Q170 58 160 65 Q150 58 150 50 Z" fill="white" opacity="0.9" />

        {/* Connecting arcs */}
        <path d="M98 142 Q128 130 136 126" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeDasharray="4 3" />
        <path d="M184 126 Q212 118 220 126" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeDasharray="4 3" />

        {/* Stars around */}
        <path d="M30 55 L31.5 60 L36 60 L32.5 63 L34 68 L30 65 L26 68 L27.5 63 L24 60 L28.5 60 Z" fill="#F5C200" opacity="0.7" />
        <path d="M285 45 L286 49 L290 49 L287 51.5 L288 55.5 L285 53.5 L282 55.5 L283 51.5 L280 49 L284 49 Z" fill="#F5C200" opacity="0.6" />
        <path d="M290 140 L291 143 L294 143 L292 145 L293 148 L290 146 L287 148 L288 145 L286 143 L289 143 Z" fill="#F5C200" opacity="0.5" />

        {/* Floating orbs */}
        <circle cx="50" cy="170" r="5" fill="rgba(245,194,0,0.3)" />
        <circle cx="270" cy="175" r="7" fill="rgba(232,64,28,0.3)" />
        <circle cx="290" cy="100" r="4" fill="rgba(255,255,255,0.15)" />
      </svg>

      {/* Text inside illustration */}
      <div className="text-center mt-2">
        <p style={{ color: "#F5C200", fontWeight: 800, fontSize: 15 }}>
          Juntos creamos impacto real
        </p>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4 }}>
          Más de 18 organizaciones ya colaboran con EZER
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          backgroundColor: "#1A2E6C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ color: "#F5C200", fontWeight: 800, fontSize: 12 }}>{number}</span>
      </div>
      <span style={{ color: "#1A2E6C", fontWeight: 800, fontSize: 15 }}>{title}</span>
      <div style={{ flex: 1, height: 1, backgroundColor: "#E5E7EB" }} />
    </div>
  );
}