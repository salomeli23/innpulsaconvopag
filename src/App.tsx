import { Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Convocatoria, FilterStatus } from './types';
import { ConvocatoriaCard } from './components/ConvocatoriaCard';
import { FilterBar } from './components/FilterBar';
import { LoginModal } from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import ConvocatoriaDetail from './components/ConvocatoriaDetail';
import { Aliados } from './components/Aliados';

function App() {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [filteredConvocatorias, setFilteredConvocatorias] = useState<Convocatoria[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState<Convocatoria | null>(null);
  const [showAliados, setShowAliados] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOfertaMenuOpen, setIsOfertaMenuOpen] = useState(false);
  const [closeTimer, setCloseTimer] = useState<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConvocatorias();
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  }

  function handleLoginSuccess() {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  }

  useEffect(() => {
    filterConvocatorias();
  }, [convocatorias, currentFilter, searchTerm]);

  async function fetchConvocatorias() {
    try {
      setLoading(true);

      // First, auto-close expired convocatorias
      await supabase.rpc('auto_close_expired_convocatorias');

      // Then fetch the updated data
      const { data: convocatoriasData, error: convError } = await supabase
        .from('convocatorias')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (convError) {
        console.error('Error fetching convocatorias:', convError);
        console.error('Full error details:', JSON.stringify(convError, null, 2));
      } else {
        console.log('Successfully fetched convocatorias. Count:', convocatoriasData?.length);
        console.log('Data:', convocatoriasData);
        setConvocatorias(convocatoriasData || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching convocatorias:', error);
    } finally {
      setLoading(false);
    }
  }

  function isClosingSoon(endDate: string): boolean {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const difference = end - now;
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

    return difference > 0 && difference <= twoDaysInMs;
  }

  function filterConvocatorias() {
    let filtered = [...convocatorias];

    if (currentFilter === 'abierta') {
      filtered = filtered.filter(conv => conv.status === 'abierta');
    } else if (currentFilter === 'cerrada') {
      filtered = filtered.filter(conv => conv.status === 'cerrada');
    } else if (currentFilter === 'por-cerrar') {
      filtered = filtered.filter(conv =>
        conv.status === 'abierta' && isClosingSoon(conv.end_date)
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(conv =>
        conv.title.toLowerCase().includes(term) ||
        conv.description.toLowerCase().includes(term)
      );
    }

    setFilteredConvocatorias(filtered);
  }


  if (isAuthenticated) {
    return <AdminPanel onLogout={handleLogout} />;
  }

  if (showAliados) {
    return <Aliados onBack={() => setShowAliados(false)} />;
  }

  if (selectedConvocatoria) {
    return (
      <ConvocatoriaDetail
        convocatoria={selectedConvocatoria}
        onBack={() => setSelectedConvocatoria(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm relative z-50">
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-20 lg:h-[100px]">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-800 transition-colors p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Navigation Menu - Desktop */}
              <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs uppercase tracking-wide">
                <a href="https://www.innpulsacolombia.com/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Inicio</a>
                <a href="https://www.innpulsacolombia.com/nosotros/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Nosotros</a>

                {/* Oferta Innpulsa Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => {
                    if (closeTimer) {
                      clearTimeout(closeTimer);
                      setCloseTimer(null);
                    }
                    setIsOfertaMenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    const timer = setTimeout(() => {
                      setIsOfertaMenuOpen(false);
                    }, 4000);
                    setCloseTimer(timer);
                  }}
                >
                  <button className="text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center gap-1">
                    OFERTA INNPULSA
                    <ChevronDown size={14} className={`transition-transform ${isOfertaMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOfertaMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-md py-2 z-50">
                      <a
                        href="https://www.innpulsacolombia.com/convocatorias.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-xs uppercase tracking-wide text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                      >
                        Convocatorias
                      </a>
                      <a
                        href="https://www.innpulsacolombia.com/aliados.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-xs uppercase tracking-wide text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                      >
                        Aliados
                      </a>
                      <a
                        href="https://www.innpulsacolombia.com/portfolio/fabricas-de-productividad-y-sostenibilidad/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-xs uppercase tracking-wide text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                      >
                        Fábricas de Productividad y Sostenibilidad
                      </a>
                    </div>
                  )}
                </div>

                <a href="https://www.innpulsacolombia.com/noticias/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Noticias</a>
                <a href="https://www.innpulsacolombia.com/centro-de-recursos/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Publicaciones</a>
                <a
                  href="https://www.innpulsacolombia.com/re.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#002F87] hover:text-[#001F5C] font-semibold transition-colors"
                >
                  Registro Único
                </a>
                <a href="https://www.innpulsacolombia.com/escribenos/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Contacto</a>
              </nav>

              {/* Right Side - Icons and Logo */}
              <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6 ml-auto">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-gray-600 hover:text-gray-800 transition-colors p-2"
                  aria-label="Login"
                >
                  <User size={20} />
                </button>
                <button className="hidden sm:block text-gray-600 hover:text-gray-800 transition-colors p-2" aria-label="Search">
                  <Search size={20} />
                </button>

                {/* Logo Divider */}
                <div className="hidden sm:block h-8 w-px bg-gray-300"></div>

                {/* Logos */}
                <div className="flex items-center">
                  <img
                    src="/muestra-1.png"
                    alt="Comercio, Industria y Turismo | INNpulsa Colombia"
                    className="w-32 h-auto sm:w-40 md:w-48 lg:w-[265px] object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 bg-white">
              <nav className="px-4 py-4 space-y-3">
                <a href="https://www.innpulsacolombia.com/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-gray-900 font-medium transition-colors py-2 text-sm uppercase tracking-wide">Inicio</a>
                <a href="https://www.innpulsacolombia.com/nosotros/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-gray-900 font-medium transition-colors py-2 text-sm uppercase tracking-wide">Nosotros</a>

                {/* Oferta Innpulsa Mobile Dropdown */}
                <div>
                  <button
                    onClick={() => setIsOfertaMenuOpen(!isOfertaMenuOpen)}
                    className="w-full flex items-center justify-between text-gray-700 hover:text-gray-900 font-medium transition-colors py-2 text-sm uppercase tracking-wide"
                  >
                    OFERTA INNPULSA
                    <ChevronDown size={16} className={`transition-transform ${isOfertaMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOfertaMenuOpen && (
                    <div className="ml-4 mt-2 space-y-2">
                      <a
                        href="https://www.innpulsacolombia.com/convocatorias.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-gray-600 hover:text-gray-900 transition-colors py-1 text-sm"
                      >
                        Convocatorias
                      </a>
                      <a
                        href="https://www.innpulsacolombia.com/category/eventos/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-gray-600 hover:text-gray-900 transition-colors py-1 text-sm"
                      >
                        Evento
                      </a>
                      <a
                        href="https://www.innpulsacolombia.com/category/proveedores/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-gray-600 hover:text-gray-900 transition-colors py-1 text-sm"
                      >
                        Proveedores
                      </a>
                      <a
                        href="https://www.innpulsacolombia.com/aliados.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-gray-600 hover:text-gray-900 transition-colors py-1 text-sm"
                      >
                        Aliados
                      </a>
                      <a
                        href="https://www.innpulsacolombia.com/portfolio/fabricas-de-productividad-y-sostenibilidad/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-gray-600 hover:text-gray-900 transition-colors py-1 text-sm"
                      >
                        Fábricas de Productividad y Sostenibilidad
                      </a>
                    </div>
                  )}
                </div>

                <a href="https://www.innpulsacolombia.com/noticias/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-gray-900 font-medium transition-colors py-2 text-sm uppercase tracking-wide">Noticias</a>
                <a href="https://www.innpulsacolombia.com/centro-de-recursos/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-gray-900 font-medium transition-colors py-2 text-sm uppercase tracking-wide">Publicaciones</a>
                <a
                  href="https://www.innpulsacolombia.com/re.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[#002F87] hover:text-[#001F5C] font-semibold transition-colors py-2 text-sm uppercase tracking-wide"
                >
                  Registro Único
                </a>
                <a href="https://www.innpulsacolombia.com/escribenos/" target="_blank" rel="noopener noreferrer" className="block text-gray-700 hover:text-gray-900 font-medium transition-colors py-2 text-sm uppercase tracking-wide">Contacto</a>
              </nav>
            </div>
          )}
        </div>
        <div className="h-1 bg-red-600"></div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="lg:flex gap-8">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center justify-between bg-white rounded-lg shadow-sm p-4 text-gray-700 font-medium"
            >
              <span>Filtros y Búsqueda</span>
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Sidebar */}
          <aside className={`
            ${isSidebarOpen ? 'block' : 'hidden'} lg:block
            w-full lg:w-64 flex-shrink-0 mb-6 lg:mb-0
          `}>
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
              <h2 className="text-base lg:text-lg font-bold text-gray-800 mb-3 lg:mb-4 capitalize">Buscar</h2>
              <input
                type="text"
                placeholder="Buscar convocatorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 lg:px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600 text-sm lg:text-base"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
              <h2 className="text-base lg:text-lg font-bold text-gray-800 mb-3 lg:mb-4">Filtrar por estado</h2>
              <FilterBar currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
            </div>
          </aside>

          {/* Cards Grid */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Cargando...</p>
              </div>
            ) : filteredConvocatorias.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No se encontraron convocatorias.</p>
                <p className="text-sm text-gray-500 mt-2">Total en base de datos: {convocatorias.length}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filteredConvocatorias.map((convocatoria) => (
                  <ConvocatoriaCard
                    key={convocatoria.id}
                    convocatoria={convocatoria}
                    onClick={() => setSelectedConvocatoria(convocatoria)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
