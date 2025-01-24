import React from 'react';
import { ChartSettings, EmptyCellHandling } from '../../types/SettingsTypes';

interface ValueSettingsProps {
  settings: ChartSettings['values'];
  onSettingsChange: (updates: Partial<ChartSettings['values']>) => void;
}

export const ValueSettings: React.FC<ValueSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  // Ensure we have default values
  const safeSettings = {
    showAtEnd: settings?.showAtEnd ?? true,
    emptyCellHandling: settings?.emptyCellHandling ?? 'zero',
    color: settings?.color ?? '#000000'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="showAtEnd"
          checked={safeSettings.showAtEnd}
          onChange={(e) => onSettingsChange({ showAtEnd: e.target.checked })}
          className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="showAtEnd" className="ml-2 block text-sm text-gray-700">
          Mostrar valores al final de la barra
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color del texto
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={safeSettings.color}
            onChange={(e) => onSettingsChange({ color: e.target.value })}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={safeSettings.color}
            onChange={(e) => onSettingsChange({ color: e.target.value })}
            placeholder="#000000"
            className="flex-1 px-3 py-1 border rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Celdas Vacías
        </label>
        <select
          value={safeSettings.emptyCellHandling}
          onChange={(e) => onSettingsChange({ 
            emptyCellHandling: e.target.value as EmptyCellHandling 
          })}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="zero">Interpretar Como 0</option>
          <option value="interpolate">Interpolar</option>
        </select>
      </div>
    </div>
  );
};