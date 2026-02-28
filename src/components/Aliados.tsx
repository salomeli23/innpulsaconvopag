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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <img
            src="/WhatsApp_Image_2026-02-27_at_7.58.43_PM.jpeg"
            alt="Regístrate como aliado de INNpulsa Colombia"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Registro de Aliados</h2>

          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {submitMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  required
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label htmlFor="nit" className="block text-sm font-medium text-gray-700 mb-2">
                  NIT *
                </label>
                <input
                  type="text"
                  id="nit"
                  name="nit"
                  required
                  value={formData.nit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
                  Sector o Industria *
                </label>
                <input
                  type="text"
                  id="sector"
                  name="sector"
                  required
                  value={formData.sector}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="max-w-md">
                <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-2">
                  Verificación: ¿Cuánto es {num1} + {num2}? *
                </label>
                <input
                  type="number"
                  id="captcha"
                  required
                  value={captchaValue}
                  onChange={(e) => setCaptchaValue(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Registrarse'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
