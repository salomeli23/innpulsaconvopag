import { Calendar, Clock, FileText, Tag, Edit } from 'lucide-react';
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="mb-6 text-[#002F87] hover:text-[#001F5C] font-medium flex items-center gap-2"
        >
          ← Volver a convocatorias
        </button>

        <article>
          <h1 className="text-3xl md:text-4xl font-bold text-[#002F87] mb-3 leading-tight">
            {convocatoria.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
            <Calendar size={14} className="text-[#002F87]" />
            <span className="text-gray-700">{formatDate(convocatoria.start_date)}</span>
            <Tag size={14} className="text-[#002F87] ml-1" />
            {convocatoria.status === 'abierta' && (
              <span className="text-green-600 font-medium">Abiertas</span>
            )}
            {convocatoria.status === 'cerrada' && (
              <span className="text-red-600 font-medium">Cerrada</span>
            )}
            <span className="text-gray-400">,</span>
            <span className="text-gray-700">Convocatorias</span>
            <span className="text-gray-400">,</span>
            <span className="text-gray-700">Todas</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="lg:w-[45%]">
              <img
                src={convocatoria.image_url}
                alt={convocatoria.title}
                className="w-full rounded"
              />
            </div>

            <div className="lg:w-[55%] space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-[#002F87] font-bold text-base mb-3">Fecha de inicio:</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#FF8C00] rounded flex items-center justify-center flex-shrink-0">
                      <Calendar className="text-white" size={20} />
                    </div>
                    <span className="text-gray-800 text-sm">{formatDate(convocatoria.start_date)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-[#002F87] font-bold text-base mb-3">Fecha de cierre:</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#FF8C00] rounded flex items-center justify-center flex-shrink-0">
                      <Calendar className="text-white" size={20} />
                    </div>
                    <span className="text-gray-800 text-sm">{formatDate(convocatoria.end_date)}</span>
                  </div>
                </div>
              </div>

              {(convocatoria.start_time || convocatoria.end_time) && (
                <div className="grid grid-cols-2 gap-6">
                  {convocatoria.start_time && (
                    <div>
                      <h3 className="text-[#002F87] font-bold text-base mb-3">Hora de inicio:</h3>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#FF8C00] rounded flex items-center justify-center flex-shrink-0">
                          <Clock className="text-white" size={20} />
                        </div>
                        <span className="text-gray-800 text-sm">{convocatoria.start_time}</span>
                      </div>
                    </div>
                  )}

                  {convocatoria.end_time && (
                    <div>
                      <h3 className="text-[#002F87] font-bold text-base mb-3">Hora de cierre:</h3>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#FF8C00] rounded flex items-center justify-center flex-shrink-0">
                          <Clock className="text-white" size={20} />
                        </div>
                        <span className="text-gray-800 text-sm">{convocatoria.end_time}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {convocatoria.registration_url && convocatoria.status === 'abierta' && (
                <div className="flex justify-center pt-2">
                  <a
                    href={convocatoria.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#002F87] text-white px-8 py-3 rounded-full font-bold hover:bg-[#001F5C] transition-colors text-sm"
                  >
                    <Edit size={16} className="text-white" />
                    Inscríbete aquí
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8 text-gray-800 leading-relaxed text-sm">
            <p>{convocatoria.description}</p>
          </div>

          {(convocatoria.target_audience || convocatoria.purpose || convocatoria.benefits) && (
            <div className="bg-[#E8F4F8] rounded-lg p-8 mb-10">
              <div className="grid md:grid-cols-3 gap-8">
                {convocatoria.target_audience && (
                  <div>
                    <h3 className="text-[#002F87] font-bold text-base mb-4">
                      ¿Para quién fue creada?
                    </h3>
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {convocatoria.target_audience}
                    </p>
                  </div>
                )}

                {convocatoria.purpose && (
                  <div>
                    <h3 className="text-[#002F87] font-bold text-base mb-4">
                      ¿Para qué fue creada?
                    </h3>
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                      {convocatoria.purpose}
                    </p>
                  </div>
                )}

                {convocatoria.benefits && (
                  <div>
                    <h3 className="text-[#002F87] font-bold text-base mb-4">
                      ¿Qué beneficios ofrece?
                    </h3>
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                      {convocatoria.benefits}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {(convocatoria.terms_url || (convocatoria.terms && convocatoria.terms.length > 0)) && (
            <div className="pt-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  <FileText className="text-[#002F87]" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#002F87] font-bold text-xl mb-3">
                    Términos de referencia y/o proceso de selección
                  </h3>

                  {convocatoria.terms_url && (
                    <div className="mb-3">
                      <a
                        href={convocatoria.terms_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                      >
                        Descargar documento (legacy)
                      </a>
                    </div>
                  )}

                  {convocatoria.terms && convocatoria.terms.length > 0 && (
                    <div className="space-y-2">
                      {convocatoria.terms.map((term) => (
                        <div key={term.id} className="flex items-center gap-2">
                          <FileText className="text-red-600" size={16} />
                          <a
                            href={term.file_url}
                            download={term.file_name}
                            className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                          >
                            {term.file_name}
                          </a>
                          <span className="text-xs text-gray-500">
                            ({(term.file_size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
