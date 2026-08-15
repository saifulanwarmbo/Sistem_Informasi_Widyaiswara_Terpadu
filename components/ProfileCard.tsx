import { useToast } from '../contexts/ToastContext';
import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { WidyaiswaraProfile, JobTier } from '../types';
import { ICONS } from '../constants';

interface ProfileCardProps {
  profile: WidyaiswaraProfile;
  isAdmin?: boolean;
  currentUserId?: string;
  onDelete?: (profile: WidyaiswaraProfile) => void;
  onPhotoChange?: (id: string, photoDataUrl: string) => void;
  onEdit?: (profile: WidyaiswaraProfile) => void;
  onViewDetails?: (profile: WidyaiswaraProfile) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isAdmin, currentUserId, onDelete, onPhotoChange, onEdit, onViewDetails }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const canEdit = isAdmin || (currentUserId && profile.ownerId === currentUserId);

  const getTierBadgeColor = (tier: JobTier): string => {
    switch (tier) {
      case JobTier.AhliUtama: return 'bg-red-100 text-red-800';
      case JobTier.AhliMadya: return 'bg-blue-100 text-blue-800';
      case JobTier.AhliMuda: return 'bg-green-100 text-green-800';
      case JobTier.AhliPertama: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePhotoEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showToast("Ukuran foto terlalu besar (maksimal 5MB sebelum kompresi).", 'error');
        return;
      }
      try {
        const { compressImage } = await import('../utils/imageCompression');
        const compressedBase64 = await compressImage(file, 200, 200, 0.6);
        if (compressedBase64.length > 150000) {
           showToast("Foto masih terlalu besar setelah dikompresi. Silakan gunakan foto lain.", 'error');
           return;
        }
        onPhotoChange?.(profile.id, compressedBase64);
      } catch (error) {
        console.error("Error compressing image:", error);
        showToast("Gagal memproses foto. Pastikan format file didukung (JPG/PNG).", 'error');
      }
    }
  };

  const latestDevelopment =
    profile.developmentHistory && profile.developmentHistory.length > 0
      ? [...profile.developmentHistory].sort(
          (a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0)
        )[0]
      : null;

  const latestPerformance =
    profile.performanceHistory && profile.performanceHistory.length > 0
      ? [...profile.performanceHistory].sort(
          (a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0)
        )[0]
      : null;

  return (
    <motion.div 
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 }
        }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="group relative bg-white rounded-lg shadow-md overflow-visible hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer"
        onClick={() => onViewDetails?.(profile)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onViewDetails?.(profile);
            }
        }}
    >
      {/* Tooltip */}
      <div className="absolute left-1/2 -top-2 transform -translate-x-1/2 -translate-y-full w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-xl pointer-events-none">
        <div className="font-semibold mb-2 border-b border-gray-700 pb-1">Ringkasan Kompetensi</div>
        {profile.performanceHistory && profile.performanceHistory.length > 0 ? (
          <ul className="list-disc pl-4 space-y-1">
            {[...profile.performanceHistory].sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0)).slice(0, 3).map(item => (
              <li key={item.id} className="truncate" title={item.performanceDescription}>
                {item.performanceDescription} ({item.year})
              </li>
            ))}
            {profile.performanceHistory.length > 3 && (
              <li className="text-gray-400 italic">...dan {profile.performanceHistory.length - 3} lainnya</li>
            )}
          </ul>
        ) : (
          <div className="text-gray-400 italic">Belum ada data kompetensi</div>
        )}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-gray-900"></div>
      </div>

      {canEdit && (
        <div className="absolute top-2 right-2 flex space-x-1 z-10">
          <button 
            onClick={(e) => {
                e.stopPropagation();
                onEdit?.(profile);
            }}
            className="bg-blue-500 text-white rounded-full h-7 w-7 flex items-center justify-center hover:bg-blue-700 transition-colors"
            aria-label="Edit Profil"
          >
            {ICONS.edit}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(profile);
            }}
            className="bg-red-500 text-white rounded-full h-7 w-7 flex items-center justify-center hover:bg-red-700 transition-colors"
            aria-label="Hapus Profil"
          >
            {ICONS.trash}
          </button>
        </div>
      )}
      <div className="p-6 flex-grow">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-shrink-0">
            <img
              className="h-16 w-16 rounded-full object-cover ring-2 ring-secondary"
              src={profile.photoUrl}
              alt={profile.name}
              loading="lazy"
            />
            {canEdit && (
              <>
                <div
                  onClick={handlePhotoEditClick}
                  className="absolute inset-0 rounded-full bg-black bg-opacity-0 hover:bg-opacity-60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  role="button"
                  aria-label="Ganti Foto Profil"
                >
                  {ICONS.camera}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-dark-text leading-tight">{profile.name}</h3>
            <p className="text-sm text-medium-text">{profile.organization}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getTierBadgeColor(profile.tier)}`}>
              {profile.tier}
            </span>
          </p>
          <p className="text-sm text-medium-text">
            <span className="font-semibold">NIP:</span> {profile.nip}
          </p>
           <p className="text-sm text-medium-text">
            <span className="font-semibold">NIWN:</span> {profile.niwn}
          </p>
        </div>
        
        {(latestDevelopment || latestPerformance) && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                {latestDevelopment && (
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pengembangan Terakhir</p>
                    <p className="text-sm text-medium-text truncate" title={`${latestDevelopment.trainingName} (${latestDevelopment.year})`}>
                    {latestDevelopment.trainingName} ({latestDevelopment.year})
                    </p>
                </div>
                )}
                {latestPerformance && (
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kompetensi Terakhir</p>
                    <p className="text-sm text-medium-text truncate" title={`${latestPerformance.performanceDescription} (${latestPerformance.year})`}>
                    {latestPerformance.performanceDescription} ({latestPerformance.year})
                    </p>
                </div>
                )}
            </div>
        )}

      </div>
      <div className="bg-light-bg px-6 py-3 border-t">
         <p className="text-sm font-medium text-medium-text">
            Angka Kredit: <span className="text-primary font-bold text-base">{profile.creditPoints}</span>
        </p>
      </div>
    </motion.div>
  );
};

export default React.memo(ProfileCard);