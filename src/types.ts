export interface ConvocatoriaTerm {
  id: string;
  convocatoria_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
  created_at: string;
}

export interface Convocatoria {
  id: string;
  title: string;
  description: string;
  image_url: string;
  status: 'abierta' | 'cerrada';
  start_date: string;
  end_date: string;
  category: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  start_time?: string;
  end_time?: string;
  registration_url?: string;
  target_audience?: string;
  purpose?: string;
  benefits?: string;
  terms_url?: string;
  terms?: ConvocatoriaTerm[];
}

export type FilterStatus = 'todas' | 'abierta' | 'cerrada' | 'por-cerrar';
