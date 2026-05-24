import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import ProfileCard from '../components/ProfileCard';
import { ICONS } from '../constants';
import { WidyaiswaraProfile, JobTier, DevelopmentHistoryItem, PerformanceHistoryItem } from '../types';
import { useWidyaiswara } from '../contexts/WidyaiswaraContext';
import { useAuth } from '../contexts/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import ProfileDetailModal from '../components/ProfileDetailModal';
import ConfirmationModal from '../components/ConfirmationModal';


const Profiles: React.FC = () => {
  const { profiles, deleteProfile, updateProfilePhoto, updateProfile } = useWidyaiswara();
  const { isLoggedIn, isAdmin } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<JobTier | 'All'>('All');
  const [editingProfile, setEditingProfile] = useState<WidyaiswaraProfile | null>(null);
  const [viewingProfile, setViewingProfile] = useState<WidyaiswaraProfile | null>(null);
  const [deletingProfile, setDeletingProfile] = useState<WidyaiswaraProfile | null>(null);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const nameMatch = profile.name.toLowerCase().includes(searchTerm.toLowerCase());
      const organizationMatch = profile.organization.toLowerCase().includes(searchTerm.toLowerCase());
      const tierMatch = selectedTier === 'All' || profile.tier === selectedTier;
      return (nameMatch || organizationMatch) && tierMatch;
    });
  }, [searchTerm, selectedTier, profiles]);
  
  const handleSaveProfile = (updatedData: Partial<Omit<WidyaiswaraProfile, 'id'>>) => {
    if (editingProfile) {
      updateProfile(editingProfile.id, updatedData);
      setEditingProfile(null); // Close modal on save
    }
  };

  const handleExportData = () => {
    if (!profiles || profiles.length === 0) {
        alert("Tidak ada data untuk diekspor.");
        return;
    }

    const headers = [
        "ID", "Nama", "NIP", "NIWN", "Jenjang Jabatan", "Instansi", 
        "Angka Kredit", "Tanggal Dibuat", "Riwayat Pengembangan", "Riwayat Kinerja"
    ];

    const escapeCsvCell = (cellData: any): string => {
        const stringData = String(cellData || '');
        if (stringData.includes(',') || stringData.includes('"') || stringData.includes('\n')) {
            return `"${stringData.replace(/"/g, '""')}"`;
        }
        return stringData;
    };

    const formatDevelopmentHistory = (history: DevelopmentHistoryItem[] | undefined): string => {
        if (!history || history.length === 0) return "";
        return history.map(h => 
            `Tahun: ${h.year}, Pelatihan: ${h.trainingName}, Penyelenggara: ${h.organizer}`
        ).join(" | ");
    };

    const formatPerformanceHistory = (history: PerformanceHistoryItem[] | undefined): string => {
        if (!history || history.length === 0) return "";
        return history.map(p => 
            `Tahun: ${p.year}, Keterangan: ${p.performanceDescription}, Catatan: ${p.notes || ''}`
        ).join(" | ");
    };

    const rows = profiles.map(profile => [
        profile.id,
        escapeCsvCell(profile.name),
        escapeCsvCell(profile.nip),
        escapeCsvCell(profile.niwn),
        escapeCsvCell(profile.tier),
        escapeCsvCell(profile.organization),
        profile.creditPoints,
        new Date(profile.createdAt).toLocaleDateString('id-ID'),
        escapeCsvCell(formatDevelopmentHistory(profile.developmentHistory)),
        escapeCsvCell(formatPerformanceHistory(profile.performanceHistory)),
    ].join(","));

    const csvString = [headers.join(","), ...rows].join("\n");
    
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        const date = new Date().toISOString().slice(0, 10);
        link.setAttribute("href", url);
        link.setAttribute("download", `widyaiswara_data_export_${date}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const handleDeleteRequest = (profile: WidyaiswaraProfile) => {
    setDeletingProfile(profile);
  };
  
  const handleConfirmDelete = () => {
      if (deletingProfile) {
          deleteProfile(deletingProfile.id);
          setDeletingProfile(null);
      }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau instansi..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {ICONS.search}
            </div>
          </div>
          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary w-full md:w-auto"
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as JobTier | 'All')}
          >
            <option value="All">Semua Jenjang</option>
            {Object.values(JobTier).map(tier => (
              <option key={tier} value={tier}>{tier}</option>
            ))}
          </select>
          {isLoggedIn && isAdmin && (
              <button
                  onClick={handleExportData}
                  className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full md:w-auto transition-colors"
              >
                  {ICONS.export}
                  <span>Ekspor Data (CSV)</span>
              </button>
          )}
        </div>
      </div>

      {filteredProfiles.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredProfiles.map(profile => (
            <ProfileCard 
                key={profile.id} 
                profile={profile} 
                isAdmin={isAdmin}
                onDelete={handleDeleteRequest}
                onPhotoChange={updateProfilePhoto}
                onEdit={setEditingProfile}
                onViewDetails={setViewingProfile}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-dark-text">Data Widyaiswara Kosong</h3>
          <p className="mt-2 text-medium-text">Belum ada data profil yang tersedia.</p>
          {isLoggedIn && isAdmin && (
            <p className="mt-1 text-sm text-medium-text">Silakan tambahkan data baru melalui halaman 'Input Data'.</p>
          )}
        </div>
      )}
      
      <EditProfileModal
        isOpen={!!editingProfile}
        onClose={() => setEditingProfile(null)}
        profile={editingProfile}
        onSave={handleSaveProfile}
      />

      <ProfileDetailModal 
        isOpen={!!viewingProfile}
        onClose={() => setViewingProfile(null)}
        profile={viewingProfile}
      />

      <ConfirmationModal
        isOpen={!!deletingProfile}
        onClose={() => setDeletingProfile(null)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus Profil"
        message={
            deletingProfile && (
                <p>
                    Apakah Anda yakin ingin menghapus profil <strong>{deletingProfile.name}</strong>? Tindakan ini tidak dapat diurungkan.
                </p>
            )
        }
      />
    </div>
  );
};

export default Profiles;