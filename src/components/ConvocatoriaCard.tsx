import { Convocatoria } from '../types';
import { CountdownTimer } from './CountdownTimer';
import { ArrowRight } from 'lucide-react';

interface ConvocatoriaCardProps {
  convocatoria: Convocatoria;
  onClick?: () => void;
}

export function ConvocatoriaCard({ convocatoria, onClick }: ConvocatoriaCardProps) {
  const isGradient = convocatoria.image_url.startsWith('/gradient-');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-64">
        {isGradient ? (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center p-6">
            <div className="text-center text-white">
              <h3 className="text-2xl font-bold mb-3 uppercase leading-tight">
                {convocatoria.title}
              </h3>
            </div>
          </div>
        ) : (
          <img
            src={convocatoria.image_url}
            alt={convocatoria.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            convocatoria.status === 'abierta'
              ? 'bg-green-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {convocatoria.status}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-800 mb-2 uppercase">
            {convocatoria.title}
          </h3>
          {convocatoria.status === 'abierta' && (
            <CountdownTimer endDate={convocatoria.end_date} />
          )}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {convocatoria.description}
        </p>
        <button
          onClick={onClick}
          className="group w-full mt-4 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-red-700 hover:to-red-800 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>Ver más información</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
