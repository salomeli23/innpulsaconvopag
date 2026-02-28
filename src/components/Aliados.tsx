import { Search, User } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AliadosProps {
  onBack: () => void;
}

export function Aliados({ onBack }: AliadosProps) {
  const [formData, setFormData] = useState({
    company_name: '',
    nit: '',
    sector: '',
    city: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const correctAnswer = num1 + num2;

  const scrollToForm = () => {
    const formElement = document.getElementById('registro-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (parseInt(captchaValue) !== correctAnswer) {
      setSubmitMessage({ type: 'error', text: 'La respuesta del captcha es incorrecta' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const { error } = await supabase
        .from('aliados_registrations')
        .insert([formData]);

      if (error) throw error;

      setSubmitMessage({ type: 'success', text: 'Registro exitoso. Nos pondremos en contacto pronto.' });
      setFormData({
        company_name: '',
        nit: '',
        sector: '',
        city: '',
        phone: '',
        email: ''
      });
      setCaptchaValue('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage({ type: 'error', text: 'Error al enviar el formulario. Por favor intente de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-[100px]">
              <nav className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-wide">
                <button onClick={onBack} className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Inicio</button>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Nosotros</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Oferta Innpulsa</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Noticias</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Publicaciones</a>
                <a
                  href="https://www.innpulsacolombia.com/re.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#002F87] hover:text-[#001F5C] font-semibold transition-colors"
                >
                  Registro Único
                </a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Aliados</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Contacto</a>
              </nav>

              <div className="flex items-center space-x-6 ml-auto">
                <button className="text-gray-600 hover:text-gray-800 transition-colors" aria-label="Login">
                  <User size={20} />
                </button>
                <button className="text-gray-600 hover:text-gray-800 transition-colors" aria-label="Search">
                  <Search size={20} />
                </button>

                <div className="h-8 w-px bg-gray-300"></div>

                <div className="flex items-center">
                  <img
                    src="/muestra-1.png"
                    alt="Comercio, Industria y Turismo | INNpulsa Colombia"
                    className="w-[265px] h-[65px] object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-1 bg-red-600"></div>
      </header>

      <div className="relative cursor-pointer" onClick={scrollToForm}>
        <div className="relative overflow-hidden flex justify-center bg-gray-100">
          <img
            src="https://res.cloudinary.com/dewemwkqf/image/upload/v1772317291/grok-image-38005b63-49a9-4fee-8aae-e42907d0dda8_1_ueqiz4.jpg"
            alt="Regístrate como aliado de INNpulsa Colombia"
            className="w-full max-w-[1400px] h-[520px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent hover:from-black/20 transition-all"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Únete a Nuestra Red de Aliados
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Forma parte del ecosistema de innovación más importante de Colombia y potencia tu negocio
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Red de Contactos</h3>
            <p className="text-gray-700">Conecta con empresas líderes y emprendedores innovadores</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Procesos de Contratación</h3>
            <p className="text-gray-700">Participa en oportunidades de negocio con INNpulsa</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Crecimiento Empresarial</h3>
            <p className="text-gray-700">Amplía tus oportunidades de negocio y visibilidad</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-2xl overflow-hidden mb-16">
          <div className="px-8 py-12 md:px-16 md:py-16">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Listo para Crecer Juntos?
              </h2>
              <p className="text-xl mb-8 text-red-50">
                Completa el formulario y comienza a formar parte de nuestra red de aliados estratégicos
              </p>
              <div className="flex justify-center gap-8 text-left">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Proceso rápido y sencillo</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Respuesta en 48 horas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="registro-form" className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900">Formulario de Registro</h2>
            <p className="text-gray-600 mt-2">Complete la información de su empresa</p>
          </div>

          <div className="p-8 md:p-12">
            {submitMessage && (
              <div className={`mb-8 p-6 rounded-xl flex items-start gap-4 ${submitMessage.type === 'success' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                {submitMessage.type === 'success' ? (
                  <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <div className={submitMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  <p className="font-semibold text-lg">{submitMessage.type === 'success' ? 'Registro Exitoso' : 'Error'}</p>
                  <p className="mt-1">{submitMessage.text}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="company_name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Nombre de la Empresa *
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                    placeholder="Ej: Empresa Innovadora S.A.S."
                  />
                </div>

                <div>
                  <label htmlFor="nit" className="block text-sm font-semibold text-gray-900 mb-2">
                    NIT *
                  </label>
                  <input
                    type="text"
                    id="nit"
                    name="nit"
                    required
                    value={formData.nit}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                    placeholder="000000000-0"
                  />
                </div>

                <div>
                  <label htmlFor="sector" className="block text-sm font-semibold text-gray-900 mb-2">
                    Sector o Industria *
                  </label>
                  <input
                    type="text"
                    id="sector"
                    name="sector"
                    required
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                    placeholder="Ej: Tecnología, Salud, Educación"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                    placeholder="Ej: Bogotá, Medellín, Cali"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                    placeholder="+57 300 000 0000"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                    placeholder="contacto@empresa.com"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <label htmlFor="captcha" className="block text-sm font-semibold text-gray-900 mb-3">
                  Verificación de seguridad *
                </label>
                <div className="flex items-center gap-4">
                  <div className="bg-white px-6 py-4 rounded-lg border-2 border-gray-300 font-mono text-2xl font-bold text-gray-900">
                    {num1} + {num2} = ?
                  </div>
                  <input
                    type="number"
                    id="captcha"
                    required
                    value={captchaValue}
                    onChange={(e) => setCaptchaValue(e.target.value)}
                    className="w-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all text-center text-xl font-semibold"
                    placeholder="?"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t-2 border-gray-200">
                <p className="text-sm text-gray-600">* Campos obligatorios</p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg rounded-xl hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    'Registrar mi Empresa'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
