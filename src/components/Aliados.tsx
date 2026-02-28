import { ArrowLeft } from 'lucide-react';

interface AliadosProps {
  onBack: () => void;
}

export function Aliados({ onBack }: AliadosProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-[100px]">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                <ArrowLeft size={20} />
                Volver
              </button>

              <div className="flex items-center ml-auto">
                <div className="h-8 w-px bg-gray-300 mr-6"></div>
                <img
                  src="/muestra-1.png"
                  alt="Comercio, Industria y Turismo | INNpulsa Colombia"
                  className="w-[265px] h-[65px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-1 bg-red-600"></div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Nuestros Aliados</h1>

          <div className="prose max-w-none">
            <p className="text-gray-700 text-lg mb-8">
              INNpulsa Colombia trabaja en conjunto con diversos aliados estratégicos para impulsar el emprendimiento y la innovación en el país.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Aliados Institucionales</h3>
                <p className="text-gray-600">
                  Entidades gubernamentales y organismos públicos que apoyan el desarrollo empresarial del país.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Aliados Privados</h3>
                <p className="text-gray-600">
                  Empresas y organizaciones del sector privado comprometidas con la innovación y el emprendimiento.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Aliados Internacionales</h3>
                <p className="text-gray-600">
                  Organizaciones globales que fortalecen nuestra red de apoyo al ecosistema emprendedor.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Universidades</h3>
                <p className="text-gray-600">
                  Instituciones académicas que contribuyen a la formación y el desarrollo de proyectos innovadores.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Aceleradoras e Incubadoras</h3>
                <p className="text-gray-600">
                  Programas especializados en el acompañamiento y crecimiento de emprendimientos.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Fondos de Inversión</h3>
                <p className="text-gray-600">
                  Entidades financieras que apoyan la capitalización de proyectos con alto potencial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
