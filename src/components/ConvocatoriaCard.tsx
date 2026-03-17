import { Convocatoria } from '../types';
import { CountdownTimer } from './CountdownTimer';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ConvocatoriaCardProps {
  convocatoria: Convocatoria;
  onClick?: () => void;
}

export function ConvocatoriaCard({ convocatoria, onClick }: ConvocatoriaCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('/gradient-blue');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImage() {
      try {
        const { data, error } = await supabase
          .from('convocatorias')
          .select('image_url')
          .eq('id', convocatoria.id)
          .single();

        if (!error && data?.image_url) {
          setImageUrl(data.image_url);
        }
      } catch (err) {
        console.error('Error loading image:', err);
      } finally {
        setLoading(false);
      }
    }

    loadImage();
  }, [convocatoria.id]);

  const isGradient = imageUrl.startsWith('/gradient-');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
      <div className="relative h-48 sm:h-56 md:h-64">
        {isGradient ? (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center p-4 sm:p-6">
            <div className="text-center text-white">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 capitalize leading-tight">
                {convocatoria.title.toLowerCase()}
              </h3>
            </div>
          </div>
        ) : (
          <>
            {loading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="text-gray-400">Cargando...</div>
              </div>
            )}
            <img
              src={imageUrl}
              alt={convocatoria.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity ${loading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setLoading(false)}
            />
          </>
        )}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold capitalize ${
            convocatoria.status === 'abierta'
              ? 'bg-green-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {convocatoria.status === 'cerrada' ? 'Finalizada' : 'Abierta'}
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 capitalize">
            {convocatoria.title.toLowerCase()}
          </h3>
          {convocatoria.status === 'abierta' && (
            convocatoria.no_end_date ? (
              <div className="text-sm font-semibold text-[#CC0C2E]">
                Hasta agotar beneficiarios ({convocatoria.beneficiaries_count} beneficiarios)
              </div>
            ) : (
              <CountdownTimer endDate={convocatoria.end_date} />
            )
          )}
        </div>
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 flex-1">
          {convocatoria.description.length > 255
            ? `${convocatoria.description.substring(0, 255)}...`
            : convocatoria.description}
        </p>
        <button
          onClick={onClick}
          className="group w-full mt-auto px-4 sm:px-6 py-2.5 sm:py-3 text-white text-sm sm:text-base font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          style={{ backgroundColor: '#0f4d7c' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0a3a5c'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f4d7c'}
        >
          <span>Ver más información</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
