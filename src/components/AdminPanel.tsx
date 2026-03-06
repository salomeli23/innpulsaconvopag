import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Convocatoria, ConvocatoriaTerm } from '../types';
import { Plus, CreditCard as Edit, Trash2, X, Upload, File, Eye, EyeOff } from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [termFiles, setTermFiles] = useState<ConvocatoriaTerm[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
    no_end_date: false,
    beneficiaries_count: undefined,
  });

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  const fetchConvocatorias = async () => {
    const { data, error } = await supabase
      .from('convocatorias')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Fetched convocatorias:', data);
    console.log('Error:', error);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen');
      e.target.value = '';
      return;
    }

    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      await new Promise((resolve) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          setFormData({ ...formData, image_url: base64 });
          resolve(null);
        };
      });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten archivos PDF, DOCX, XLSX y XLS');
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
            display_name: '',
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

  const handleUpdateTermDisplayName = async (termId: string, displayName: string) => {
    if (termId.startsWith('temp-')) {
      setTermFiles(termFiles.map(t =>
        t.id === termId ? { ...t, display_name: displayName } : t
      ));
    } else {
      const { error } = await supabase
        .from('convocatoria_terms')
        .update({ display_name: displayName })
        .eq('id', termId);

      if (!error) {
        setTermFiles(termFiles.map(t =>
          t.id === termId ? { ...t, display_name: displayName } : t
        ));
      }
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
      no_end_date: false,
      beneficiaries_count: undefined,
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-8 w-full max-w-7xl my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Editar Convocatoria' : 'Nueva Convocatoria'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'abierta' | 'cerrada' })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    >
                      <option value="abierta">Abierta</option>
                      <option value="cerrada">Cerrada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Inicio * <span className="text-xs text-gray-500">(Zona horaria: Colombia UTC-5)</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.start_date?.split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Inicio <span className="text-xs text-gray-500">(Hora de Colombia)</span>
                    </label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Cierre * <span className="text-xs text-gray-500">(Zona horaria: Colombia UTC-5)</span>
                    </label>
                    <input
                      type="date"
                      required={!formData.no_end_date}
                      disabled={formData.no_end_date}
                      value={formData.end_date?.split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Cierre <span className="text-xs text-gray-500">(Hora de Colombia)</span>
                    </label>
                    <input
                      type="time"
                      disabled={formData.no_end_date}
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="no_end_date"
                        checked={formData.no_end_date || false}
                        onChange={(e) => setFormData({ ...formData, no_end_date: e.target.checked })}
                        className="w-4 h-4 text-[#CC0C2E] border-gray-300 rounded focus:ring-[#CC0C2E]"
                      />
                      <label htmlFor="no_end_date" className="text-sm font-medium text-gray-700">
                        Sin fecha de cierre (Hasta agotar beneficiarios)
                      </label>
                    </div>

                    {formData.no_end_date && (
                      <div className="ml-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cantidad de Beneficiarios *
                        </label>
                        <input
                          type="number"
                          min="1"
                          required={formData.no_end_date}
                          value={formData.beneficiaries_count || ''}
                          onChange={(e) => setFormData({ ...formData, beneficiaries_count: parseInt(e.target.value) || undefined })}
                          className="w-full md:w-64 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                          placeholder="Ej: 100"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagen de la Convocatoria *
                    </label>
                    {formData.image_url ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image_url: '' })}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        uploadingImage
                          ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                          : 'border-gray-300 hover:border-[#CC0C2E] hover:bg-gray-50'
                      }`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            {uploadingImage ? 'Subiendo imagen...' : 'Click para subir imagen'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de Inscripción
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.registration_url}
                      onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de Términos (legacy)
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.terms_url}
                      onChange={(e) => setFormData({ ...formData, terms_url: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Para quién fue creada?
                    </label>
                    <textarea
                      rows={4}
                      value={formData.target_audience}
                      onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Para qué fue creada?
                    </label>
                    <textarea
                      rows={4}
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Qué beneficios ofrece?
                    </label>
                    <textarea
                      rows={4}
                      value={formData.benefits}
                      onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Archivos de Términos de Referencia (PDF/DOCX/XLSX/XLS) - Máximo 15
                  </label>
                  <div className="space-y-3">
                    {Array.from({ length: 15 }).map((_, index) => {
                      const existingFile = termFiles[index];
                      const isEnabled = index === 0 || termFiles[index - 1] !== undefined;

                      return (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-sm font-medium text-gray-600 flex-shrink-0 mt-2">
                              {index + 1}.
                            </span>

                            {existingFile ? (
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <File size={16} className="text-red-600 flex-shrink-0" />
                                  <span className="text-sm text-gray-700 font-medium">
                                    {existingFile.file_name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({(existingFile.file_size / 1024).toFixed(1)} KB)
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTermFile(existingFile.id, index)}
                                    className="text-red-600 hover:text-red-800 ml-auto flex-shrink-0"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Nombre para mostrar (opcional)
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Ej: Términos y condiciones"
                                    value={existingFile.display_name || ''}
                                    onChange={(e) => handleUpdateTermDisplayName(existingFile.id, e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                                  />
                                </div>
                              </div>
                            ) : (
                              <label
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                                  !isEnabled
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : uploadingFile
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                                }`}
                              >
                                <Upload size={16} />
                                {uploadingFile ? 'Subiendo...' : 'Adjuntar Archivo'}
                                <input
                                  type="file"
                                  accept="application/pdf,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xlsx,application/vnd.ms-excel,.xls"
                                  onChange={(e) => handleFileUpload(e, index)}
                                  disabled={!isEnabled || uploadingFile}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#CC0C2E] text-white font-medium rounded-lg hover:bg-[#A00A25] transition-colors"
                  >
                    {editingId ? 'Actualizar Convocatoria' : 'Crear Convocatoria'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-100 border-b">
            <p className="text-sm text-gray-600">Total de convocatorias: {convocatorias.length}</p>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
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
              {convocatorias.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay convocatorias disponibles
                  </td>
                </tr>
              ) : (
                convocatorias.map((convocatoria) => (
                <tr key={convocatoria.id} className={!convocatoria.is_active ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={convocatoria.title}>
                      {convocatoria.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        convocatoria.status === 'abierta'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {convocatoria.status === 'cerrada' ? 'Por Finalizar' : 'Abierta'}
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
                    {new Date(convocatoria.end_date).toLocaleDateString('es-CO', { timeZone: 'UTC' })}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
