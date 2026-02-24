import { Calendar, Clock, FileText, Tag } from 'lucide-react';
import { Convocatoria } from '../types';

interface ConvocatoriaDetailProps {
  convocatoria: Convocatoria;
  onBack: () => void;
}

export default function ConvocatoriaDetail({ convocatoria, onBack }: ConvocatoriaDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="mb-8 text-[#002F87] hover:text-[#001F5C] font-medium flex items-center gap-2"
        >
          ← Volver a convocatorias
        </button>

        <article>
          <h1 className="text-4xl md:text-5xl font-bold text-[#002F87] mb-6 leading-tight">
            {convocatoria.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mb-8 text-sm">
            <Calendar size={16} className="text-[#002F87]" />
            <span className="text-gray-700">{formatDate(convocatoria.start_date)}</span>
            <Tag size={16} className="text-[#002F87] ml-2" />
            {convocatoria.status === 'abierta' && (
              <span className="text-green-600 font-medium">Abiertas</span>
            )}
            {convocatoria.status === 'cerrada' && (
              <span className="text-red-600 font-medium">Cerrada</span>
            )}
            <span className="text-gray-400">•</span>
            <span className="text-gray-700">Convocatorias</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-700">Todas</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-10">
            <div className="lg:w-1/2">
              <img
                src={convocatoria.image_url}
                alt={convocatoria.title}
                className="w-full rounded-lg shadow-md"
              />
            </div>

            <div className="lg:w-1/2 space-y-6">
              <div>
                <h3 className="text-[#002F87] font-bold text-lg mb-3">Fecha de inicio:</h3>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-[#FF8C00] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-white" size={26} />
                  </div>
                  <span className="text-gray-800 text-base">{formatDate(convocatoria.start_date)}</span>
                </div>
              </div>

              <div>
                <h3 className="text-[#002F87] font-bold text-lg mb-3">Fecha de cierre:</h3>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-[#FF8C00] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-white" size={26} />
                  </div>
                  <span className="text-gray-800 text-base">{formatDate(convocatoria.end_date)}</span>
                </div>
              </div>

              {convocatoria.start_time && (
                <div>
                  <h3 className="text-[#002F87] font-bold text-lg mb-3">Hora de inicio:</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#FF8C00] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="text-white" size={26} />
                    </div>
                    <span className="text-gray-800 text-base">{convocatoria.start_time}</span>
                  </div>
                </div>
              )}

              {convocatoria.end_time && (
                <div>
                  <h3 className="text-[#002F87] font-bold text-lg mb-3">Hora de cierre:</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#FF8C00] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="text-white" size={26} />
                    </div>
                    <span className="text-gray-800 text-base">{convocatoria.end_time}</span>
                  </div>
                </div>
              )}

              {convocatoria.registration_url && convocatoria.status === 'abierta' && (
                <div className="pt-4">
                  <a
                    href={convocatoria.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#002F87] text-white px-10 py-4 rounded-full font-bold hover:bg-[#001F5C] transition-colors text-base shadow-lg"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 7.5L10 12.5L7.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Inscríbete aquí
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="mb-10 text-gray-800 leading-relaxed text-base">
            <p>{convocatoria.description}</p>
          </div>

          {(convocatoria.target_audience || convocatoria.purpose || convocatoria.benefits) && (
            <div className="grid md:grid-cols-3 gap-6 mb-12 bg-gray-50 p-8 rounded-lg">
              {convocatoria.target_audience && (
                <div>
                  <h3 className="text-[#002F87] font-bold text-lg mb-4">
                    ¿Para quién fue creada?
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {convocatoria.target_audience}
                  </p>
                </div>
              )}

              {convocatoria.purpose && (
                <div>
                  <h3 className="text-[#002F87] font-bold text-lg mb-4">
                    ¿Para qué fue creada?
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {convocatoria.purpose}
                  </p>
                </div>
              )}

              {convocatoria.benefits && (
                <div>
                  <h3 className="text-[#002F87] font-bold text-lg mb-4">
                    ¿Qué beneficios ofrece?
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {convocatoria.benefits}
                  </p>
                </div>
              )}
            </div>
          )}

          {convocatoria.terms_url && (
            <div className="border-t border-gray-200 pt-10">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="text-[#002F87]" size={40} />
                </div>
                <div>
                  <h3 className="text-[#002F87] font-bold text-2xl mb-2">
                    Términos de referencia y/o proceso de selección
                  </h3>
                  <a
                    href={convocatoria.terms_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-base font-medium"
                  >
                    Descargar documento
                  </a>
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
