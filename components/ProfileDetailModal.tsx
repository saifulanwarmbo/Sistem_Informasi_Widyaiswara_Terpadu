import React, { useEffect, useRef } from 'react';
import { WidyaiswaraProfile, JobTier, DevelopmentHistoryItem, PerformanceHistoryItem } from '../types';
import { ICONS } from '../constants'; // Re-use an icon if we want, or just an SVG for print

interface ProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: WidyaiswaraProfile | null;
}

const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ isOpen, onClose, profile }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen || !profile) return null;

  const getTierBadgeColor = (tier: JobTier): string => {
    switch (tier) {
      case JobTier.AhliUtama: return 'bg-red-100 text-red-800';
      case JobTier.AhliMadya: return 'bg-blue-100 text-blue-800';
      case JobTier.AhliMuda: return 'bg-green-100 text-green-800';
      case JobTier.AhliPertama: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const HistorySection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div>
        <h4 className="text-lg font-semibold text-dark-text mb-3 border-b pb-2">{title}</h4>
        {children}
    </div>
  );
  
  const DevHistoryItem: React.FC<{ item: DevelopmentHistoryItem }> = ({ item }) => (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
        <p className="font-semibold text-medium-text">{item.trainingName} <span className="font-normal text-gray-500">- {item.year}</span></p>
        <p className="text-sm text-gray-500">Penyelenggara: {item.organizer}</p>
    </div>
  );

  const PromHistoryItem: React.FC<{ item: any }> = ({ item }) => (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
        <p className="font-semibold text-medium-text">{item.newTier} <span className="font-normal text-gray-500">- {item.year}</span></p>
        {item.notes && <p className="text-sm text-gray-500 italic mt-1">Keterangan: {item.notes}</p>}
    </div>
  );

  const PerfHistoryItem: React.FC<{ item: PerformanceHistoryItem }> = ({ item }) => (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
        <p className="font-semibold text-medium-text">{item.performanceDescription} <span className="font-normal text-gray-500">- {item.year}</span></p>
        {item.notes && <p className="text-sm text-gray-500 italic mt-1">Catatan: {item.notes}</p>}
    </div>
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style type="text/css" media="print">
        {`
          body * {
            visibility: hidden;
          }
          #profile-detail-modal-root, #profile-detail-modal-root * {
            visibility: visible;
          }
          #profile-detail-modal-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            max-height: none;
            overflow: visible;
            box-shadow: none;
            background: white;
          }
          .print-hidden {
            display: none !important;
          }
        `}
      </style>
      <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 print:absolute print:inset-0 print:bg-white print:p-0" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="profile-detail-title"
          onClick={onClose}
      >
        <div 
          id="profile-detail-modal-root"
          className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col print:shadow-none print:w-full print:max-w-none print:h-auto print:max-h-none print:block"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-lg print:border-none print:p-0 print:mb-6">
            <h3 id="profile-detail-title" className="text-2xl font-bold text-primary print:text-3xl print:text-black">{profile.name} - Profil Lengkap</h3>
            <div className="flex items-center gap-4 print-hidden">
               <button 
                onClick={handlePrint} 
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-accent border border-accent rounded-md hover:bg-accent hover:text-white transition-colors"
                aria-label="Cetak Profil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Cetak Profil
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors" aria-label="Tutup">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-8 print:p-0 print:overflow-visible">
            {/* Profile Summary */}
            <div className="flex flex-col md:flex-row items-start gap-6 print:flex-row print:items-center">
              <img
                className="h-32 w-32 rounded-full object-cover ring-4 ring-secondary flex-shrink-0 print:ring-gray-300"
                src={profile.photoUrl}
                alt={profile.name}
              />
              <div className="space-y-3 flex-grow">
                 <span className={`inline-block rounded-full px-4 py-1 text-sm font-semibold print:text-black print:border print:border-gray-300 print:bg-transparent ${getTierBadgeColor(profile.tier)}`}>
                    {profile.tier}
                  </span>
                  <p className="text-lg text-medium-text font-medium print:text-black">{profile.organization}</p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <p><span className="font-semibold text-dark-text print:text-black">NIP:</span> {profile.nip}</p>
                      <p><span className="font-semibold text-dark-text print:text-black">NIWN:</span> {profile.niwn}</p>
                      <p><span className="font-semibold text-dark-text print:text-black">Angka Kredit:</span> <span className="text-primary font-bold print:text-black">{profile.creditPoints}</span></p>
                      <p><span className="font-semibold text-dark-text print:text-black">Bergabung:</span> {new Date(profile.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
              </div>
            </div>
            
            {/* History Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t print:block print:space-y-10">
               <div className="print:mb-10 lg:col-span-2">
                 <HistorySection title="Riwayat Kenaikan Jenjang">
                    {profile.promotionHistory && profile.promotionHistory.length > 0 ? (
                        profile.promotionHistory.map(item => <PromHistoryItem key={item.id} item={item} />)
                    ) : (
                        <p className="text-sm text-gray-500 italic print:text-black">Tidak ada riwayat kenaikan jenjang yang tersedia.</p>
                    )}
                 </HistorySection>
               </div>

               <div className="print:mb-10">
                 <HistorySection title="Riwayat Pengembangan Profesi">
                    {profile.developmentHistory && profile.developmentHistory.length > 0 ? (
                        profile.developmentHistory.map(item => <DevHistoryItem key={item.id} item={item} />)
                    ) : (
                        <p className="text-sm text-gray-500 italic print:text-black">Tidak ada riwayat pengembangan yang tersedia.</p>
                    )}
                 </HistorySection>
               </div>

               <div>
                 <HistorySection title="Riwayat Kinerja">
                     {profile.performanceHistory && profile.performanceHistory.length > 0 ? (
                        profile.performanceHistory.map(item => <PerfHistoryItem key={item.id} item={item} />)
                    ) : (
                        <p className="text-sm text-gray-500 italic print:text-black">Tidak ada riwayat kinerja yang tersedia.</p>
                    )}
                 </HistorySection>
               </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDetailModal;
