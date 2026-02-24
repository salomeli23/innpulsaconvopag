import { Calendar, Clock, FileText } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="mb-6 text-[#002F87] hover:text-[#001F5C] font-medium flex items-center gap-2"
        >
          ← Volver a convocatorias
        </button>

        <article className="bg-white rounded-lg shadow-sm">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-[#002F87] mb-4">
              {convocatoria.title}
            </h1>

            <div className="flex flex-wrap gap-3 mb-6 text-sm">
              <span className="inline-flex items-center gap-1 text-gray-600">
                <Calendar size={16} className="text-[#002F87]" />
                {formatDate(convocatoria.start_date)}
              </span>
              <span className="text-gray-400">•</span>
              {convocatoria.status === 'abierta' && (
                <span className="text-green-600 font-semibold">Abiertas</span>
              )}
              {convocatoria.status === 'cerrada' && (
                <span className="text-red-600 font-semibold">Cerrada</span>
              )}
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">Convocatorias</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">Todas</span>
            </div>

            <div className="mb-8">
              <img
                src={convocatoria.image_url}
                alt={convocatoria.title}
                className="w-full max-w-2xl rounded-lg"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-[#002F87] font-bold text-lg mb-4">Fecha de inicio:</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Calendar className="text-white" size={24} />
                  </div>
                  <span className="text-gray-800 font-medium">{formatDate(convocatoria.start_date)}</span>
                </div>

                {convocatoria.start_time && (
                  <>
                    <h3 className="text-[#002F87] font-bold text-lg mb-4 mt-6">Hora de inicio:</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Clock className="text-white" size={24} />
                      </div>
                      <span className="text-gray-800 font-medium">{convocatoria.start_time}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-[#002F87] font-bold text-lg mb-4">Fecha de cierre:</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Calendar className="text-white" size={24} />
                  </div>
                  <span className="text-gray-800 font-medium">{formatDate(convocatoria.end_date)}</span>
                </div>

                {convocatoria.end_time && (
                  <>
                    <h3 className="text-[#002F87] font-bold text-lg mb-4 mt-6">Hora de cierre:</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Clock className="text-white" size={24} />
                      </div>
                      <span className="text-gray-800 font-medium">{convocatoria.end_time}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {convocatoria.registration_url && convocatoria.status === 'abierta' && (
              <div className="text-center mb-8">
                <a
                  href={convocatoria.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#002F87] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#001F5C] transition-colors text-lg"
                >
                  <span>✏️</span>
                  Inscríbete aquí
                </a>
              </div>
            )}

            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed text-base">
                {convocatoria.description}
              </p>
            </div>

            {(convocatoria.target_audience || convocatoria.purpose || convocatoria.benefits) && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {convocatoria.target_audience && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-[#002F87] font-bold text-lg mb-4">
                      ¿Para quién fue creada?
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {convocatoria.target_audience}
                    </p>
                  </div>
                )}

                {convocatoria.purpose && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-[#002F87] font-bold text-lg mb-4">
                      ¿Para qué fue creada?
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {convocatoria.purpose}
                    </p>
                  </div>
                )}

                {convocatoria.benefits && (
                  <div className="bg-gray-50 rounded-lg p-6">
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
              <div className="border-t pt-8">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="text-[#002F87]" size={32} />
                  </div>
                  <div>
                    <h3 className="text-[#002F87] font-bold text-xl mb-2">
                      Términos de referencia y/o proceso de selección
                    </h3>
                    <a
                      href={convocatoria.terms_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Descargar documento
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
