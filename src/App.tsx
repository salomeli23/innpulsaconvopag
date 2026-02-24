import { Search, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Convocatoria, FilterStatus } from './types';
import { ConvocatoriaCard } from './components/ConvocatoriaCard';
import { FilterBar } from './components/FilterBar';
import { LoginModal } from './components/LoginModal';
import AdminPanel from './components/AdminPanel';
import ConvocatoriaDetail from './components/ConvocatoriaDetail';

function App() {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [filteredConvocatorias, setFilteredConvocatorias] = useState<Convocatoria[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedConvocatoria, setSelectedConvocatoria] = useState<Convocatoria | null>(null);

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
      const { data, error } = await supabase
        .from('convocatorias')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConvocatorias(data || []);
    } catch (error) {
      console.error('Error fetching convocatorias:', error);
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <img
                  src="/muestra-1.png"
                  alt="Comercio, Industria y Turismo | INNpulsa Colombia"
                  className="h-12"
                />
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-700 hover:text-red-600 font-medium">INICIO</a>
              <a href="#" className="text-gray-700 hover:text-red-600 font-medium">NOSOTROS</a>
              <a href="#" className="text-gray-400 font-medium">OFERTA INNPULSA</a>
              <a href="#" className="text-gray-700 hover:text-red-600 font-medium">NOTICIAS</a>
              <a href="#" className="text-gray-700 hover:text-red-600 font-medium">PUBLICACIONES</a>
              <a href="#" className="text-gray-700 hover:text-red-600 font-medium">REGISTRO</a>
              <a href="#" className="text-gray-700 hover:text-red-600 font-medium">CONTACTO</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-gray-600 hover:text-gray-800"
              >
                <User size={20} />
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="h-1 bg-red-600"></div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Buscar</h2>
              <input
                type="text"
                placeholder="Buscar convocatorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Filtrar por estado</h2>
              <FilterBar currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
            </div>
          </aside>

          {/* Cards Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="mt-4 text-gray-600">Cargando convocatorias...</p>
              </div>
            ) : filteredConvocatorias.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No se encontraron convocatorias.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
