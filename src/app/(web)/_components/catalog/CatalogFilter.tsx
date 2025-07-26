'use client';

import { useState } from 'react';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'buttons' | 'select' | 'checkbox' | 'range';
  options?: FilterOption[];
  multiple?: boolean;
}

interface CatalogFilterProps {
  title?: string;
  filters: FilterConfig[];
  onFilterChange?: (filterId: string, value: any) => void;
  className?: string;
  type?: 'hair' | 'color' | 'transformation' | 'mens';
}

export const CatalogFilter = ({ 
  title = '絞り込み検索', 
  filters, 
  onFilterChange,
  className = '',
  type = 'hair'
}: CatalogFilterProps) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    setActiveFilters(newFilters);
    onFilterChange?.(filterId, value);
  };

  const getButtonColor = (type: string) => {
    switch (type) {
      case 'color':
        return 'hover:bg-purple-50 hover:border-purple-300';
      case 'transformation':
        return 'hover:bg-indigo-50 hover:border-indigo-300';
      case 'mens':
        return 'hover:bg-blue-50 hover:border-blue-300';
      default:
        return 'hover:bg-pink-50 hover:border-pink-300';
    }
  };

  const getFocusColor = (type: string) => {
    switch (type) {
      case 'color':
        return 'focus:ring-purple-500 focus:border-purple-500';
      case 'transformation':
        return 'focus:ring-indigo-500 focus:border-indigo-500';
      case 'mens':
        return 'focus:ring-blue-500 focus:border-blue-500';
      default:
        return 'focus:ring-pink-500 focus:border-pink-500';
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    filters.forEach(filter => {
      onFilterChange?.(filter.id, null);
    });
  };

  const renderFilterOption = (filter: FilterConfig) => {
    switch (filter.type) {
      case 'buttons':
        return (
          <div className="flex flex-wrap gap-2">
            {filter.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange(filter.id, option.value)}
                className={`px-3 py-1 text-sm border border-gray-300 rounded-full transition-colors ${
                  activeFilters[filter.id] === option.value
                    ? `bg-${type === 'mens' ? 'blue' : type === 'color' ? 'purple' : type === 'transformation' ? 'indigo' : 'pink'}-100 border-${type === 'mens' ? 'blue' : type === 'color' ? 'purple' : type === 'transformation' ? 'indigo' : 'pink'}-300 text-${type === 'mens' ? 'blue' : type === 'color' ? 'purple' : type === 'transformation' ? 'indigo' : 'pink'}-700`
                    : `${getButtonColor(type)}`
                }`}
              >
                {option.label}
                {option.count && (
                  <span className="ml-1 text-xs opacity-60">({option.count})</span>
                )}
              </button>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            value={activeFilters[filter.id] || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${getFocusColor(type)}`}
          >
            <option value="">選択してください</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
                {option.count && ` (${option.count})`}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={activeFilters[filter.id]?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValues = activeFilters[filter.id] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    handleFilterChange(filter.id, newValues);
                  }}
                  className={`mr-2 rounded border-gray-300 ${
                    type === 'mens' ? 'text-blue-500 focus:ring-blue-500' :
                    type === 'color' ? 'text-purple-500 focus:ring-purple-500' :
                    type === 'transformation' ? 'text-indigo-500 focus:ring-indigo-500' :
                    'text-pink-500 focus:ring-pink-500'
                  }`}
                />
                <span className="text-sm text-gray-700">
                  {option.label}
                  {option.count && (
                    <span className="ml-1 text-xs text-gray-500">({option.count})</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        );

      case 'range':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="0"
                max="100"
                value={activeFilters[filter.id]?.[0] || 0}
                onChange={(e) => {
                  const currentRange = activeFilters[filter.id] || [0, 100];
                  handleFilterChange(filter.id, [parseInt(e.target.value), currentRange[1]]);
                }}
                className={`flex-1 ${
                  type === 'mens' ? 'accent-blue-500' :
                  type === 'color' ? 'accent-purple-500' :
                  type === 'transformation' ? 'accent-indigo-500' :
                  'accent-pink-500'
                }`}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={activeFilters[filter.id]?.[1] || 100}
                onChange={(e) => {
                  const currentRange = activeFilters[filter.id] || [0, 100];
                  handleFilterChange(filter.id, [currentRange[0], parseInt(e.target.value)]);
                }}
                className={`flex-1 ${
                  type === 'mens' ? 'accent-blue-500' :
                  type === 'color' ? 'accent-purple-500' :
                  type === 'transformation' ? 'accent-indigo-500' :
                  'accent-pink-500'
                }`}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{activeFilters[filter.id]?.[0] || 0}</span>
              <span>{activeFilters[filter.id]?.[1] || 100}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {Object.keys(activeFilters).length > 0 && (
          <button
            onClick={clearAllFilters}
            className={`text-sm ${
              type === 'mens' ? 'text-blue-600 hover:text-blue-700' :
              type === 'color' ? 'text-purple-600 hover:text-purple-700' :
              type === 'transformation' ? 'text-indigo-600 hover:text-indigo-700' :
              'text-pink-600 hover:text-pink-700'
            } transition-colors`}
          >
            クリア
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filters.map((filter) => (
          <div key={filter.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {filter.label}
            </label>
            {renderFilterOption(filter)}
          </div>
        ))}
      </div>

      {/* Active filters summary */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">適用中のフィルター</h4>
          <div className="flex flex-wrap gap-1">
            {Object.entries(activeFilters).map(([filterId, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              
              const filter = filters.find(f => f.id === filterId);
              if (!filter) return null;

              const displayValue = Array.isArray(value) ? value.join(', ') : value;
              
              return (
                <span
                  key={filterId}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    type === 'mens' ? 'bg-blue-100 text-blue-800' :
                    type === 'color' ? 'bg-purple-100 text-purple-800' :
                    type === 'transformation' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-pink-100 text-pink-800'
                  }`}
                >
                  {filter.label}: {displayValue}
                  <button
                    onClick={() => handleFilterChange(filterId, null)}
                    className="ml-1 hover:text-gray-600"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogFilter;