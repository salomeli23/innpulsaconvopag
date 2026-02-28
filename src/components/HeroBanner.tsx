import { ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onRegisterClick: () => void;
}

export function HeroBanner({ onRegisterClick }: HeroBannerProps) {
  return (
    <div className="max-w-7xl w-full mx-auto my-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">

        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10 bg-white/90 backdrop-blur-sm">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            ¿Estás interesado en contratar bienes y servicios con <span className="text-blue-600">iNN</span><span className="text-red-600">pulsa</span> Colombia?
          </h1>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
            Regístrate aquí
          </h2>

          <ul className="space-y-4 mb-10">
            <li className="flex items-start">
              <svg className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
              <span className="text-lg text-gray-700">Participa en procesos de contratación.</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
              <span className="text-lg text-gray-700">Amplía tus oportunidades de negocio.</span>
            </li>
            <li className="flex items-start">
              <svg className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
              <span className="text-lg text-gray-700">Forma parte de nuestra red de aliados.</span>
            </li>
          </ul>

          <button
            onClick={onRegisterClick}
            className="w-full md:w-auto bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-lg text-xl flex items-center justify-center group transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            Regístrate Aquí
            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="w-full md:w-1/2 relative h-64 md:h-auto min-h-[300px]">
          <img
            src="https://image.qwenlm.ai/public_source/baf918e2-761d-4d5e-b451-9bdc7d2d8485/1d0356e3b-2e1f-4500-b104-104ea14ba9f1.png"
            alt="Personas latinas de negocios"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10 md:hidden"></div>

          <div className="absolute bottom-6 right-6 flex items-center gap-4 bg-white/90 p-4 rounded-lg backdrop-blur-md shadow-lg">
            <img
              src="https://res.cloudinary.com/dewemwkqf/image/upload/v1772320147/muestra-1__1_-removebg-preview_bl6lbi.png"
              alt="Comercio Industria y Turismo - iNNpulsa Colombia"
              className="h-20 w-auto object-contain"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
