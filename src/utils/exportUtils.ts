import { Convocatoria } from '../types';

export const exportToExcel = async (convocatorias: Convocatoria[]) => {
  const headers = [
    'ID',
    'Título',
    'Descripción',
    'Estado',
    'Fecha Inicio',
    'Fecha Cierre',
    'Sin Fecha Cierre',
    'Hora Inicio',
    'Hora Cierre',
    'Categoría',
    'URL Inscripción',
    'URL Términos',
    'Audiencia',
    'Propósito',
    'Beneficios',
    'Beneficiarios',
    'Activa',
    'Fecha Creación',
    'Fecha Actualización'
  ];

  let csv = headers.join(',') + '\n';

  convocatorias.forEach((conv) => {
    const row = [
      conv.id,
      `"${(conv.title || '').replace(/"/g, '""')}"`,
      `"${(conv.description || '').replace(/"/g, '""')}"`,
      conv.status,
      conv.start_date || '',
      conv.end_date || '',
      conv.no_end_date ? 'Sí' : 'No',
      conv.start_time || '',
      conv.end_time || '',
      conv.category || '',
      conv.registration_url || '',
      conv.terms_url || '',
      `"${(conv.target_audience || '').replace(/"/g, '""')}"`,
      `"${(conv.purpose || '').replace(/"/g, '""')}"`,
      `"${(conv.benefits || '').replace(/"/g, '""')}"`,
      conv.beneficiaries_count || '',
      conv.is_active ? 'Sí' : 'No',
      conv.created_at || '',
      conv.updated_at || ''
    ];
    csv += row.join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `convocatorias_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToSQL = (convocatorias: Convocatoria[]) => {
  let sql = `-- Exportación de Convocatorias - ${new Date().toLocaleString('es-CO')}\n`;
  sql += `-- Total de registros: ${convocatorias.length}\n\n`;

  sql += `-- Crear tabla convocatorias si no existe\n`;
  sql += `CREATE TABLE IF NOT EXISTS convocatorias (\n`;
  sql += `  id UUID PRIMARY KEY,\n`;
  sql += `  title TEXT NOT NULL,\n`;
  sql += `  description TEXT,\n`;
  sql += `  image_url TEXT,\n`;
  sql += `  status TEXT NOT NULL,\n`;
  sql += `  start_date DATE,\n`;
  sql += `  end_date DATE,\n`;
  sql += `  no_end_date BOOLEAN DEFAULT false,\n`;
  sql += `  start_time TIME,\n`;
  sql += `  end_time TIME,\n`;
  sql += `  category TEXT,\n`;
  sql += `  registration_url TEXT,\n`;
  sql += `  terms_url TEXT,\n`;
  sql += `  target_audience TEXT,\n`;
  sql += `  purpose TEXT,\n`;
  sql += `  benefits TEXT,\n`;
  sql += `  beneficiaries_count INTEGER,\n`;
  sql += `  is_active BOOLEAN DEFAULT true,\n`;
  sql += `  created_at TIMESTAMPTZ DEFAULT NOW(),\n`;
  sql += `  updated_at TIMESTAMPTZ DEFAULT NOW()\n`;
  sql += `);\n\n`;

  sql += `-- Insertar convocatorias\n`;

  convocatorias.forEach((conv, index) => {
    const escapeSQL = (str: string | null | undefined) => {
      if (!str) return 'NULL';
      return `'${str.replace(/'/g, "''")}'`;
    };

    const values = [
      escapeSQL(conv.id),
      escapeSQL(conv.title),
      escapeSQL(conv.description),
      escapeSQL(conv.image_url),
      escapeSQL(conv.status),
      conv.start_date ? escapeSQL(conv.start_date) : 'NULL',
      conv.end_date ? escapeSQL(conv.end_date) : 'NULL',
      conv.no_end_date ? 'true' : 'false',
      conv.start_time ? escapeSQL(conv.start_time) : 'NULL',
      conv.end_time ? escapeSQL(conv.end_time) : 'NULL',
      escapeSQL(conv.category),
      escapeSQL(conv.registration_url),
      escapeSQL(conv.terms_url),
      escapeSQL(conv.target_audience),
      escapeSQL(conv.purpose),
      escapeSQL(conv.benefits),
      conv.beneficiaries_count || 'NULL',
      conv.is_active ? 'true' : 'false',
      conv.created_at ? escapeSQL(conv.created_at) : 'NOW()',
      conv.updated_at ? escapeSQL(conv.updated_at) : 'NOW()'
    ];

    sql += `INSERT INTO convocatorias (\n`;
    sql += `  id, title, description, image_url, status, start_date, end_date, no_end_date,\n`;
    sql += `  start_time, end_time, category, registration_url, terms_url, target_audience,\n`;
    sql += `  purpose, benefits, beneficiaries_count, is_active, created_at, updated_at\n`;
    sql += `) VALUES (\n`;
    sql += `  ${values.join(',\n  ')}\n`;
    sql += `);\n\n`;
  });

  const blob = new Blob([sql], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `convocatorias_backup_${new Date().toISOString().split('T')[0]}.sql`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
