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
}

export type FilterStatus = 'todas' | 'abierta' | 'cerrada' | 'por-cerrar';
