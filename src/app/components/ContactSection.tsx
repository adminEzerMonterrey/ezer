"use client";

import { useState } from "react";
import { Clock3, Landmark, Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";

export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  return (
    <section id="contacto" className="pt-8 pb-12 md:pt-10 md:pb-16 bg-white font-['Plus_Jakarta_Sans']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-[#1A2E6C] font-extrabold text-[clamp(2rem,5vw,3rem)] leading-tight mt-2">
            Contáctanos
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            ¿Tienes alguna duda o quieres saber más sobre cómo podemos colaborar? Estamos listos para escucharte y resolver todas tus inquietudes.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 mb-16 max-w-4xl mx-auto">
          {status !== 'success' && (
            <div className="text-center mb-8">
              <h3 className="text-[#1A2E6C] font-extrabold text-2xl md:text-3xl mb-3">
                Envíanos un mensaje
              </h3>
              <p className="text-gray-500 text-lg">
                Llena el siguiente formulario y nos pondremos en contacto contigo lo más pronto posible.
              </p>
            </div>
          )}

          {status === 'success' ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#1A2E6C] mb-3">¡Mensaje Enviado!</h3>
              <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                Nos pondremos en contacto contigo pronto. ¡Gracias por comunicarte con Ezer!
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="bg-[#1A2E6C] hover:bg-[#2a4393] text-white font-bold py-3 px-8 rounded-xl transition-all"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={async (e) => { 
              e.preventDefault();
              setStatus('loading');
              const form = e.target as HTMLFormElement;
              const data = {
                name: (form.elements.namedItem('name') as HTMLInputElement).value,
                email: (form.elements.namedItem('email') as HTMLInputElement).value,
                subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
                message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
              };
              
              try {
                await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
                });
                setStatus('success');
                form.reset();
              } catch (err) {
                setStatus('error');
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-bold text-sm mb-2">
                    Nombre completo <span className="text-[#E8401C]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all outline-none text-gray-800"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-bold text-sm mb-2">
                    Correo electrónico <span className="text-[#E8401C]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all outline-none text-gray-800"
                    placeholder="tu@correo.com"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 font-bold text-sm mb-2">
                  Asunto <span className="text-[#E8401C]">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all outline-none text-gray-800"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <div className="mb-8">
                <label htmlFor="message" className="block text-gray-700 font-bold text-sm mb-2">
                  Mensaje <span className="text-[#E8401C]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#1A2E6C]/20 focus:border-[#1A2E6C] transition-all outline-none text-gray-800 resize-y"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-gradient-to-r from-[#1A2E6C] to-[#2a4393] text-white font-extrabold py-4 px-10 rounded-xl inline-flex items-center gap-3 hover:shadow-lg hover:shadow-blue-900/20 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  <Send size={20} />
                  {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="text-center mb-10">
          <h3 className="text-[#1A2E6C] font-extrabold text-3xl">
            Información
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-8 text-center hover:-translate-y-2 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-6">
              <Clock3 size={32} className="text-[#1A2E6C]" />
            </div>
            <h3 className="text-[#1A2E6C] font-extrabold text-xl mb-3">Horario</h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">Nuestro equipo está disponible para atenderte dentro de este horario.</p>
            <p className="text-[#1A2E6C] font-extrabold text-lg leading-tight">
              9 a.m. a 1 p.m.<br />
              Lunes a viernes
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-8 text-center hover:-translate-y-2 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-6">
              <Phone size={32} className="text-[#E8401C]" />
            </div>
            <h3 className="text-[#1A2E6C] font-extrabold text-xl mb-3">Teléfono</h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">Llámanos directamente para recibir atención personalizada de nuestro equipo.</p>
            <a href="tel:+528112572544" className="text-[#E8401C] font-extrabold text-xl hover:underline">
              +52 81 1257 2544
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-8 text-center hover:-translate-y-2 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-6">
              <Mail size={32} className="text-[#1A2E6C]" />
            </div>
            <h3 className="text-[#1A2E6C] font-extrabold text-xl mb-3">Correo Electrónico</h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">Escríbenos y te responderemos a la brevedad con toda la información necesaria.</p>
            <a href="mailto:voluntariadocorporativo@ezer.org.mx" className="text-[#1A2E6C] font-extrabold text-base hover:underline break-words">
              voluntariadocorporativo@ezer.org.mx
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-8 text-center hover:-translate-y-2 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center mx-auto mb-6">
              <MapPin size={32} className="text-[#F5C200]" />
            </div>
            <h3 className="text-[#1A2E6C] font-extrabold text-xl mb-3">Ubicación</h3>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">Visítanos en nuestras oficinas centrales y conoce más de nuestro trabajo.</p>
            <p className="text-[#1A2E6C] font-extrabold text-base leading-tight">
              Francisco Zarco 911, Piso 3<br />
              Centro, 64000 Monterrey, N.L.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 transition-transform hover:-translate-y-1">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="lg:max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                <Landmark size={32} className="text-[#1A2E6C]" />
              </div>
              <h3 className="text-[#1A2E6C] font-extrabold text-2xl mb-4">
                ¿Te gustaría apoyar con un donativo?
              </h3>
              <p className="text-gray-500 text-base leading-relaxed">
                Si deseas sumarte a nuestra labor, puedes realizar una transferencia bancaria a la siguiente cuenta de EZER.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 hover:border-[#1A2E6C]/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <p className="text-gray-400 text-xs font-extrabold tracking-wider uppercase mb-2">Titular</p>
                <p className="text-[#1A2E6C] text-xl font-extrabold">EZER ABP</p>
              </div>

              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 hover:border-[#1A2E6C]/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <p className="text-gray-400 text-xs font-extrabold tracking-wider uppercase mb-2">Cuenta</p>
                <p className="text-[#1A2E6C] text-xl font-extrabold">0198974066</p>
              </div>

              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 hover:border-[#1A2E6C]/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <p className="text-gray-400 text-xs font-extrabold tracking-wider uppercase mb-2">CLABE</p>
                <p className="text-[#1A2E6C] text-lg font-extrabold break-words">072 580 00198974066 6</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
