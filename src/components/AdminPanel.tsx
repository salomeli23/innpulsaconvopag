import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Convocatoria, ConvocatoriaTerm } from '../types';
import { Plus, CreditCard as Edit, Trash2, X, Upload, File, Eye, EyeOff, Users, FileSpreadsheet, Database, LogOut } from 'lucide-react';
import { exportToExcel, exportToSQL } from '../utils/exportUtils';

interface AdminPanelProps {
  onLogout: () => void;
}

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'convocatorias' | 'users'>('convocatorias');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });
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
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (activeTab === 'users' && (currentUserEmail === 'convocatorias@admin.com' || currentUserEmail === 'karen.rodriguez@innpulsacolombia.com')) {
      fetchUsers();
    }
  }, [activeTab, currentUserEmail]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      setCurrentUserEmail(user.email);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/list-admin-users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            adminKey: 'innpulsa2026'
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        console.error('Error fetching users:', data.error);
        return;
      }

      const formattedUsers: AdminUser[] = data.users.map((user: any) => ({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUserEmail || !newUserPassword) {
      setConfirmationModal({
        show: true,
        type: 'error',
        message: 'Por favor ingresa usuario y contraseña'
      });
      return;
    }

    setCreatingUser(true);

    try {
      // Convertir el usuario a formato de email para Supabase
      const emailFormat = newUserEmail.includes('@') ? newUserEmail : `${newUserEmail}@admin.com`;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-admin-users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            users: [{ email: emailFormat, password: newUserPassword }],
            adminKey: 'innpulsa2026'
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        setConfirmationModal({
          show: true,
          type: 'error',
          message: data.error || 'Error desconocido'
        });
      } else if (data.results && data.results[0]) {
        const result = data.results[0];
        if (result.success) {
          setConfirmationModal({
            show: true,
            type: 'success',
            message: `Usuario ${newUserEmail} creado exitosamente`
          });
          setNewUserEmail('');
          setNewUserPassword('');
          setShowUserForm(false);
          fetchUsers();
        } else {
          setConfirmationModal({
            show: true,
            type: 'error',
            message: result.error
          });
        }
      } else {
        setConfirmationModal({
          show: true,
          type: 'success',
          message: `Usuario ${newUserEmail} creado exitosamente`
        });
        setNewUserEmail('');
        setNewUserPassword('');
        setShowUserForm(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      setConfirmationModal({
        show: true,
        type: 'error',
        message: 'Error al crear usuario: ' + error
      });
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`¿Estás seguro de eliminar el usuario ${email}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-admin-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            userId,
            adminKey: 'innpulsa2026'
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        alert('Error al eliminar usuario: ' + (data.error || 'Error desconocido'));
      } else {
        alert('Usuario eliminado exitosamente');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar usuario');
    }
  };

  const handleResetPassword = async (email: string) => {
    const newPassword = prompt(`Ingresa la nueva contraseña para ${email}:`);

    if (!newPassword) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email,
            newPassword,
            adminKey: 'innpulsa2026'
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        alert('Contraseña actualizada exitosamente');
      }
    } catch (error) {
      alert('Error al resetear contraseña');
    }
  };

  const fetchConvocatorias = async () => {
    try {
      // Try to auto-close expired convocatorias (ignore errors)
      await supabase.rpc('auto_close_expired_convocatorias').catch(err => {
        console.log('Auto-close function skipped:', err);
      });
    } catch (e) {
      // Silent fail - not critical
    }

    // Fetch the updated data
    const { data, error } = await supabase
      .from('convocatorias')
      .select('id, title, description, image_url, start_date, end_date, no_end_date, status, is_active, beneficiaries_count, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching convocatorias:', error);
    }

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

  const isSuperAdmin = currentUserEmail === 'convocatorias@admin.com' || currentUserEmail === 'karen.rodriguez@innpulsacolombia.com';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            {isSuperAdmin && (
              <div className="flex gap-2 border-l border-gray-300 pl-4">
                <button
                  onClick={() => setActiveTab('convocatorias')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'convocatorias'
                      ? 'bg-[#CC0C2E] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Convocatorias
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === 'users'
                      ? 'bg-[#CC0C2E] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Users size={16} />
                  Usuarios
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#CC0C2E] rounded-lg hover:bg-[#A00A25] transition-colors"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'convocatorias' && (
          <>
            <div className="mb-6 flex gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#CC0C2E] text-white rounded-lg hover:bg-[#A00A25] transition-colors"
              >
                <Plus size={20} />
                Nueva Convocatoria
              </button>
              <button
                onClick={() => exportToExcel(convocatorias)}
                disabled
                className="flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-50"
                title="Exportar a Excel (CSV) - Deshabilitado"
              >
                <FileSpreadsheet size={20} />
                Exportar Excel
              </button>
              <button
                onClick={() => exportToSQL(convocatorias)}
                disabled
                className="flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-50"
                title="Exportar a SQL - Deshabilitado"
              >
                <Database size={20} />
                Exportar SQL
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
              {convocatorias.map((convocatoria) => (
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
              }
              </tbody>
            </table>
          </div>
          </>
        )}

        {activeTab === 'users' && isSuperAdmin && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowUserForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#CC0C2E] text-white rounded-lg hover:bg-[#A00A25] transition-colors"
              >
                <Plus size={20} />
                Crear Usuario
              </button>
            </div>

            {showUserForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-8 w-full max-w-md">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Crear Usuario</h2>
                    <button
                      onClick={() => setShowUserForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usuario *
                      </label>
                      <input
                        type="text"
                        required
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                        placeholder="usuario"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña *
                      </label>
                      <input
                        type="password"
                        required
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CC0C2E] focus:border-transparent"
                        placeholder="Mínimo 8 caracteres"
                        minLength={8}
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={creatingUser}
                        className="flex-1 px-6 py-3 bg-[#CC0C2E] text-white font-medium rounded-lg hover:bg-[#A00A25] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {creatingUser ? 'Creando...' : 'Crear Usuario'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUserForm(false)}
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
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
                <p className="text-sm text-gray-600">Total de usuarios: {users.length}</p>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Creación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Acceso
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('es-CO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.last_sign_in_at
                          ? new Date(user.last_sign_in_at).toLocaleDateString('es-CO')
                          : 'Nunca'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleResetPassword(user.email)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Resetear contraseña"
                        >
                          <Edit size={18} />
                        </button>
                        {user.email !== currentUserEmail && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar usuario"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {confirmationModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-2xl">
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                confirmationModal.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {confirmationModal.type === 'success' ? (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              <h3 className={`text-xl font-bold mb-2 ${
                confirmationModal.type === 'success' ? 'text-green-900' : 'text-red-900'
              }`}>
                {confirmationModal.type === 'success' ? 'Operación Exitosa' : 'Error'}
              </h3>

              <p className="text-gray-700 text-center mb-6">
                {confirmationModal.message}
              </p>

              <button
                onClick={() => setConfirmationModal({ show: false, type: 'success', message: '' })}
                className="px-6 py-2.5 bg-[#CC0C2E] text-white font-medium rounded-lg hover:bg-[#A00A25] transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-yellow-100">
                <LogOut className="w-8 h-8 text-yellow-600" />
              </div>

              <h3 className="text-xl font-bold mb-2 text-gray-900">
                Confirmar Cierre de Sesión
              </h3>

              <p className="text-gray-700 text-center mb-6">
                ¿Estás seguro de que deseas cerrar sesión?
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    onLogout();
                  }}
                  className="flex-1 px-6 py-2.5 bg-[#CC0C2E] text-white font-medium rounded-lg hover:bg-[#A00A25] transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
