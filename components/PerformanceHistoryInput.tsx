import React from 'react';
import { PerformanceHistoryItem } from '../types';
import { ICONS } from '../constants';

interface PerformanceHistoryInputProps {
  history: PerformanceHistoryItem[];
  onChange: (history: PerformanceHistoryItem[]) => void;
}

const PerformanceHistoryInput: React.FC<PerformanceHistoryInputProps> = ({ history, onChange }) => {

  const handleAddItem = () => {
    const newItem: PerformanceHistoryItem = {
      id: Date.now().toString(),
      year: '',
      performanceDescription: '',
      notes: '',
    };
    onChange([...history, newItem]);
  };

  const handleItemChange = (index: number, field: keyof Omit<PerformanceHistoryItem, 'id'>, value: string) => {
    const newHistory = [...history];
    newHistory[index] = { ...newHistory[index], [field]: value };
    onChange(newHistory);
  };

  const handleDeleteItem = (id: string) => {
    onChange(history.filter(item => item.id !== id));
  };

  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Riwayat Kinerja</h3>
      <div className="space-y-4">
        {history.length > 0 ? history.map((item, index) => (
          <div key={item.id} className="p-4 border rounded-md bg-gray-50 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600">Tahun</label>
                <input
                  type="number"
                  placeholder="2024"
                  value={item.year}
                  onChange={(e) => handleItemChange(index, 'year', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600">Keterangan Kinerja</label>
                <input
                  type="text"
                  placeholder="Menyusun 5 modul pelatihan..."
                  value={item.performanceDescription}
                  onChange={(e) => handleItemChange(index, 'performanceDescription', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                />
              </div>
               <div className="col-span-1 md:col-span-3">
                <label className="block text-xs font-medium text-gray-600">Catatan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Diterbitkan oleh..."
                  value={item.notes}
                  onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleDeleteItem(item.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors"
              aria-label="Hapus Riwayat Kinerja"
            >
              {ICONS.trash}
            </button>
          </div>
        )) : (
            <p className="text-sm text-gray-500 text-center py-4">Belum ada riwayat kinerja yang ditambahkan.</p>
        )}
      </div>
      <button
        type="button"
        onClick={handleAddItem}
        className="mt-4 inline-flex items-center px-4 py-2 border border-dashed border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
      >
        <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        Tambah Riwayat Kinerja
      </button>
    </div>
  );
};

export default PerformanceHistoryInput;