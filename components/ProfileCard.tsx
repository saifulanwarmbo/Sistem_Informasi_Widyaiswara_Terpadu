import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { WidyaiswaraProfile, JobTier } from '../types';
import { ICONS } from '../constants';

interface ProfileCardProps {
  profile: WidyaiswaraProfile;
  isAdmin?: boolean;
  onDelete?: (profile: WidyaiswaraProfile) => void;
  onPhotoChange?: (id: string, photoDataUrl: string) => void;
  onEdit?: (profile: WidyaiswaraProfile) => void;
  onViewDetails?: (profile: WidyaiswaraProfile) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isAdmin, onDelete, onPhotoChange, onEdit, onViewDetails }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoChange?.(profile.id, reader.result as string);
      };
      reader.readAsDataURL(file);
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
        className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer"
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
      {isAdmin && (
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
            />
            {isAdmin && (
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
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kinerja Terakhir</p>
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

export default ProfileCard;