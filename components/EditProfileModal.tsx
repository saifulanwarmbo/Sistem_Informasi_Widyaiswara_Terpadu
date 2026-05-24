import React, { useState, useEffect } from 'react';
import { WidyaiswaraProfile, JobTier, DevelopmentHistoryItem, PerformanceHistoryItem } from '../types';
import DevelopmentHistoryInput from './DevelopmentHistoryInput';
import PerformanceHistoryInput from './PerformanceHistoryInput';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: WidyaiswaraProfile | null;
  onSave: (updatedData: Partial<Omit<WidyaiswaraProfile, 'id'>>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState<Partial<WidyaiswaraProfile>>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        nip: profile.nip,
        niwn: profile.niwn,
        organization: profile.organization,
        tier: profile.tier,
        creditPoints: profile.creditPoints,
        developmentHistory: profile.developmentHistory || [],
        performanceHistory: profile.performanceHistory || [],
      });
    }
  }, [profile]);

  if (!isOpen || !profile) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'creditPoints' ? Number(value) : value }));
  };

  const handleDevHistoryChange = (history: DevelopmentHistoryItem[]) => {
      setFormData(prev => ({ ...prev, developmentHistory: history }));
  };

  const handlePerfHistoryChange = (history: PerformanceHistoryItem[]) => {
      setFormData(prev => ({ ...prev, performanceHistory: history }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData };

    if (finalData.developmentHistory) {
        finalData.developmentHistory = finalData.developmentHistory.filter(
            item => item.year.trim() !== '' || item.trainingName.trim() !== '' || item.organizer.trim() !== ''
        );
    }
    
    if (finalData.performanceHistory) {
        finalData.performanceHistory = finalData.performanceHistory.filter(
            item => item.year.trim() !== '' || item.performanceDescription.trim() !== ''
        );
    }
    onSave(finalData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6 border-b">
          <h3 id="edit-profile-title" className="text-xl font-semibold text-primary">Edit Profil Widyaiswara</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="nip" className="block text-sm font-medium text-gray-700">NIP</label>
                    <input type="text" id="nip" name="nip" value={formData.nip || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="niwn" className="block text-sm font-medium text-gray-700">NIWN</label>
                    <input type="text" id="niwn" name="niwn" value={formData.niwn || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Instansi</label>
                    <input type="text" id="organization" name="organization" value={formData.organization || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="tier" className="block text-sm font-medium text-gray-700">Jenjang Jabatan</label>
                    <select id="tier" name="tier" value={formData.tier || ''} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm">
                        {Object.values(JobTier).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="creditPoints" className="block text-sm font-medium text-gray-700">Angka Kredit</label>
                    <input type="number" id="creditPoints" name="creditPoints" value={formData.creditPoints || 0} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                </div>
            </div>
            <DevelopmentHistoryInput
                history={formData.developmentHistory || []}
                onChange={handleDevHistoryChange}
            />
            <PerformanceHistoryInput
                history={formData.performanceHistory || []}
                onChange={handlePerfHistoryChange}
            />
          </div>
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">
              Batal
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;