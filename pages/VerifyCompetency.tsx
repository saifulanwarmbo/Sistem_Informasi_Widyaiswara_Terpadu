import React, { useState } from 'react';
import { useCompetency } from '../contexts/CompetencyContext';
import { useWidyaiswara } from '../contexts/WidyaiswaraContext';
import { ICONS } from '../constants';
import { CompetencyRegistration, RegistrationStatus } from '../types';

const VerifyCompetency: React.FC = () => {
  const { registrations, updateRegistrationStatus } = useCompetency();
  const { profiles } = useWidyaiswara();

  const [selectedReg, setSelectedReg] = useState<CompetencyRegistration | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (status: RegistrationStatus) => {
    if (!selectedReg) return;
    setIsUpdating(true);
    try {
      await updateRegistrationStatus(selectedReg.id, status, adminNotes);
      setSelectedReg(null);
      setAdminNotes('');
      alert(`Status pendaftaran berhasil diperbarui menjadi ${status === 'verified' ? 'Disetujui' : 'Ditolak'}.`);
    } catch (error) {
      console.error("Error updating status", error);
      alert("Terjadi kesalahan saat memperbarui status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark-text">Verifikasi Uji Kompetensi</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Widyaiswara</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pengajuan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrations.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  Belum ada pendaftaran Uji Kompetensi.
                </td>
              </tr>
            ) : (
              registrations.map(reg => {
                const profile = profiles.find(p => p.id === reg.profileId);
                return (
                  <tr key={reg.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{profile?.name || 'Profil tidak ditemukan'}</div>
                      <div className="text-sm text-gray-500">{profile?.nip}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reg.submissionDate).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reg.status === 'pending' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Menunggu</span>}
                      {reg.status === 'verified' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Disetujui</span>}
                      {reg.status === 'rejected' && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Ditolak</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedReg(reg);
                          setAdminNotes(reg.adminNotes || '');
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedReg && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-8 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Detail Pendaftaran</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Dokumen Persyaratan</p>
              <ul className="space-y-2 bg-gray-50 p-4 rounded-md border">
                {selectedReg.documents.map((doc, index) => (
                  <li key={index} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                    {ICONS.document}
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="underline">{doc.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Admin (Opsional)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Tambahkan catatan jika diperlukan..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isUpdating}
              >
                Tutup
              </button>
              {selectedReg.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    disabled={isUpdating}
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('verified')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    disabled={isUpdating}
                  >
                    Setujui
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCompetency;
