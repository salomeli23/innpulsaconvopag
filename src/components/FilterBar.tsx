import { FilterStatus } from '../types';

interface FilterBarProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
}

export function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  const filters: { value: FilterStatus; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'abierta', label: 'Abiertas' },
    { value: 'por-cerrar', label: 'Por Finalizar' },
    { value: 'cerrada', label: 'Finalizadas' },
  ];

  return (
    <div className="space-y-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
            currentFilter === filter.value
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
