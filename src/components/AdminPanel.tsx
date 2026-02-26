import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Convocatoria, ConvocatoriaTerm } from '../types';
import { Plus, Edit, Trash2, X, Upload, File, Eye, EyeOff } from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [termFiles, setTermFiles] = useState<ConvocatoriaTerm[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formData, setFormData] = useState<Partial<Convocatoria>>({
    title: '',
    description: '',
    image_url: '',
    status: 'abierta',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    category: 'convocatorias',
    registration_url: '',
    target_audience: '',
    purpose: '',
    benefits: '',
    terms_url: '',
    is_active: true,
  });

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  const fetchConvocatorias = async () => {
    const { data, error } = await supabase
      .from('convocatorias')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setConvocatorias(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from('convocatorias')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId);

      if (!error) {
        fetchConvocatorias();
        resetForm();
      }
    } else {
      const { data, error } = await supabase
        .from('convocatorias')
        .insert([formData])
        .select()
        .single();

      if (!error && data) {
        const tempTerms = termFiles.filter(t => t.id.startsWith('temp-'));
        if (tempTerms.length > 0) {
          const termsToInsert = tempTerms.map(t => ({
            convocatoria_id: data.id,
            file_name: t.file_name,
            file_url: t.file_url,
            file_size: t.file_size,
          }));

          await supabase
            .from('convocatoria_terms')
            .insert(termsToInsert);
        }

        fetchConvocatorias();
        resetForm();
      }
    }
  };

  const handleEdit = async (convocatoria: Convocatoria) => {
    setEditingId(convocatoria.id);
    setFormData(convocatoria);

    const { data: terms } = await supabase
      .from('convocatoria_terms')
      .select('*')
      .eq('convocatoria_id', convocatoria.id)
      .order('created_at', { ascending: false });

    if (terms) {
      setTermFiles(terms);
    }

    setShowForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (file.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF');
      e.target.value = '';
      return;
    }

    setUploadingFile(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      await new Promise((resolve) => {
        reader.onload = async () => {
          const base64 = reader.result as string;

          const newTerm: Partial<ConvocatoriaTerm> = {
            convocatoria_id: editingId || '',
            file_name: file.name,
            file_url: base64,
            file_size: file.size,
          };

          if (editingId) {
            const { error } = await supabase
              .from('convocatoria_terms')
              .insert([newTerm]);

            if (!error) {
              const { data: terms } = await supabase
                .from('convocatoria_terms')
                .select('*')
                .eq('convocatoria_id', editingId)
                .order('created_at', { ascending: true });

              if (terms) {
                setTermFiles(terms);
              }
            }
          } else {
            setTermFiles([...termFiles, { ...newTerm, id: `temp-${Date.now()}`, uploaded_at: new Date().toISOString(), created_at: new Date().toISOString() } as ConvocatoriaTerm]);
          }

          resolve(null);
        };
      });
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  };

  const handleDeleteTermFile = async (termId: string, slotIndex: number) => {
    if (termId.startsWith('temp-')) {
      setTermFiles(termFiles.filter(t => t.id !== termId));
    } else {
      const { error } = await supabase
        .from('convocatoria_terms')
        .delete()
        .eq('id', termId);

      if (!error) {
        setTermFiles(termFiles.filter(t => t.id !== termId));
      }
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const action = currentStatus ? 'desactivar' : 'activar';
    if (confirm(`¿Estás seguro de ${action} esta convocatoria?`)) {
      const { error } = await supabase
        .from('convocatorias')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (!error) {
        fetchConvocatorias();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar permanentemente esta convocatoria? Esta acción no se puede deshacer.')) {
      const { error } = await supabase
        .from('convocatorias')
        .delete()
        .eq('id', id);

      if (!error) {
        fetchConvocatorias();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      status: 'abierta',
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      category: 'convocatorias',
      registration_url: '',
      target_audience: '',
      purpose: '',
      benefits: '',
      is_active: true,
      terms_url: '',
    });
    setEditingId(null);
    setTermFiles([]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#CC0C2E] text-white rounded-lg hover:bg-[#A00A25] transition-colors"
          >
            <Plus size={20} />
            Nueva Convocatoria
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl my-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingId ? 'Editar Convocatoria' : 'Nueva Convocatoria'}
                </h2>
                <button onClick={resetForm}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'abierta' | 'cerrada' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    >
                      <option value="abierta">Abierta</option>
                      <option value="cerrada">Cerrada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.start_date?.split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de Inicio
                    </label>
                    <input
                      type="text"
                      placeholder="ej: 3:00 pm"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Cierre *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.end_date?.split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de Cierre
                    </label>
                    <input
                      type="text"
                      placeholder="ej: 11:59 pm"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de Imagen *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="/ruta-imagen.jpg"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de Inscripción
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.registration_url}
                      onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de Términos (legacy)
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.terms_url}
                      onChange={(e) => setFormData({ ...formData, terms_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archivos de Términos de Referencia (PDF) - Máximo 15
                  </label>
                  <div className="space-y-2">
                    {Array.from({ length: 15 }).map((_, index) => {
                      const existingFile = termFiles[index];
                      const isEnabled = index === 0 || termFiles[index - 1] !== undefined;

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-sm font-medium text-gray-600 w-8">
                              {index + 1}.
                            </span>

                            {existingFile ? (
                              <div className="flex items-center gap-2 flex-1">
                                <File size={16} className="text-red-600" />
                                <span className="text-sm text-gray-700">{existingFile.file_name}</span>
                                <span className="text-xs text-gray-500">
                                  ({(existingFile.file_size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                            ) : (
                              <label
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-colors text-sm ${
                                  !isEnabled
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : uploadingFile
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                                }`}
                              >
                                <Upload size={14} />
                                {uploadingFile ? 'Subiendo...' : 'Adjuntar PDF'}
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  onChange={(e) => handleFileUpload(e, index)}
                                  disabled={!isEnabled || uploadingFile}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>

                          {existingFile && (
                            <button
                              type="button"
                              onClick={() => handleDeleteTermFile(existingFile.id, index)}
                              className="text-red-600 hover:text-red-800 ml-2"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ¿Para quién fue creada?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.target_audience}
                    onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ¿Para qué fue creada?
                  </label>
                  <textarea
                    rows={4}
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ¿Qué beneficios ofrece?
                  </label>
                  <textarea
                    rows={4}
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#CC0C2E] text-white py-3 rounded-lg hover:bg-[#A00A25] transition-colors"
                  >
                    {editingId ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visibilidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Cierre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {convocatorias.map((convocatoria) => (
                <tr key={convocatoria.id} className={!convocatoria.is_active ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{convocatoria.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        convocatoria.status === 'abierta'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {convocatoria.status === 'cerrada' ? 'Finalizada' : 'Abierta'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        convocatoria.is_active
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {convocatoria.is_active ? 'Visible' : 'Oculta'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(convocatoria.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {convocatoria.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(convocatoria)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(convocatoria.id, convocatoria.is_active)}
                      className={`mr-3 ${
                        convocatoria.is_active
                          ? 'text-orange-600 hover:text-orange-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                      title={convocatoria.is_active ? 'Desactivar' : 'Activar'}
                    >
                      {convocatoria.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(convocatoria.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar permanentemente"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
