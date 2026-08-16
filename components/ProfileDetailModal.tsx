import { useToast } from '../contexts/ToastContext';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { WidyaiswaraProfile, JobTier, DevelopmentHistoryItem, PerformanceHistoryItem } from '../types';
import { useWidyaiswara } from '../contexts/WidyaiswaraContext';

interface ProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: WidyaiswaraProfile | null;
}

const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ isOpen, onClose, profile }) => {
  const { showToast } = useToast();
  const { getDocument } = useWidyaiswara();
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'pdf' | null>(null);
  const [showQR, setShowQR] = useState(false);
  const profileUrl = `${window.location.origin}/#/profiles?id=${profile?.id}`;

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
  
  const handleViewDocument = async (id: string, fallbackBase64?: string) => {
    setLoadingDocId(id);
    let base64Data = await getDocument(id);
    if (!base64Data && fallbackBase64) {
        base64Data = fallbackBase64;
    }
    setLoadingDocId(null);
    
    if (!base64Data) {
        showToast("Dokumen tidak ditemukan atau terjadi kesalahan.", 'error');
        return;
    }
    
    try {
      const arr = base64Data.split(',');
      if (arr.length < 2) {
          return;
      }
      
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) {
          return;
      }
      
      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const url = URL.createObjectURL(blob);
      
      setPreviewType(mime.includes('image') ? 'image' : 'pdf');
      setPreviewUrl(url);
    } catch (e) {
      showToast("Tidak dapat membuka dokumen.", 'error');
    }
  };

  const DevHistoryItem: React.FC<{ item: DevelopmentHistoryItem }> = ({ item }) => (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
        <p className="font-semibold text-medium-text">{item.trainingName} <span className="font-normal text-gray-500">- {item.year}</span></p>
        <p className="text-sm text-gray-500 mb-1">Penyelenggara: {item.organizer}</p>
        {item.creditPoints !== undefined && item.creditPoints > 0 && <p className="text-sm text-green-600 font-medium mb-1">Tambahan AK (Kolektif): {item.creditPoints}</p>}
        {item.documentName && (
          <div className="flex items-center space-x-3 mt-1 print-hidden">
            <button type="button" disabled={loadingDocId === item.id} onClick={() => handleViewDocument(item.id, item.documentBase64)} className="inline-flex items-center text-sm text-primary hover:text-secondary disabled:opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {loadingDocId === item.id ? 'Memuat...' : 'Lihat Dokumen'}
            </button>
          </div>
        )}
    </div>
  );

  const PromHistoryItem: React.FC<{ item: { id: string; year: string; [key: string]: string } }> = ({ item }) => (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
        <p className="font-semibold text-medium-text">{item.newTier} <span className="font-normal text-gray-500">- {item.year}</span></p>
        {item.notes && <p className="text-sm text-gray-500 italic mt-1 mb-1">Keterangan: {item.notes}</p>}
        {item.creditPoints !== undefined && item.creditPoints > 0 && <p className="text-sm text-green-600 font-medium mt-1 mb-1">Tambahan AK (Kolektif): {item.creditPoints}</p>}
        {item.documentName && (
          <div className="flex items-center space-x-3 mt-1 print-hidden">
            <button type="button" disabled={loadingDocId === item.id} onClick={() => handleViewDocument(item.id, item.documentBase64)} className="inline-flex items-center text-sm text-primary hover:text-secondary disabled:opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {loadingDocId === item.id ? 'Memuat...' : 'Lihat Dokumen'}
            </button>
          </div>
        )}
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
          .print-hidden {
            display: none !important;
          }
          @page {
            margin: 0;
            margin-top: 1cm;
            margin-bottom: 1cm;
          }
        `}
      </style>
      <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 print:static print:bg-transparent print:p-0 print:block" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="profile-detail-title"
          onClick={onClose}
      >
        <div 
          id="profile-detail-modal-root"
          className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col print:shadow-none print:w-full print:max-w-none print:h-auto print:max-h-none print:block print:m-0"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-lg print:border-none print:p-0 print:mb-6">
            <h3 id="profile-detail-title" className="text-2xl font-bold text-primary print:text-3xl print:text-black">{profile.name} - Profil Lengkap</h3>
            <div className="flex items-center gap-4 print-hidden">
              <button 
                onClick={() => setShowQR(true)} 
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                aria-label="QR Code Profil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                QR Code
              </button>
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
                 <div>
                   <span className={`inline-block rounded-full px-4 py-1 text-sm font-semibold print:text-black print:border print:border-gray-300 print:bg-transparent ${getTierBadgeColor(profile.tier)}`}>
                      {profile.tier}
                   </span>
                   <p className="text-sm text-gray-500 mt-2 print:text-black"><span className="font-semibold text-dark-text print:text-black">TMT Widyaiswara:</span> {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date(profile.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                 </div>
                  <p className="text-lg text-medium-text font-medium print:text-black">{profile.organization}</p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <p><span className="font-semibold text-dark-text print:text-black">NIP:</span> {profile.nip}</p>
                      <p><span className="font-semibold text-dark-text print:text-black">NIWN:</span> {profile.niwn}</p>
                      <p><span className="font-semibold text-dark-text print:text-black">Angka Kredit:</span> <span className="text-primary font-bold print:text-black">{profile.creditPoints}</span></p>
                      {profile.whatsappNumber && <p><span className="font-semibold text-dark-text print:text-black">No. WA:</span> {profile.whatsappNumber}</p>}
                  </div>
              </div>
            </div>
            
            {/* History Details */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t print:block print:space-y-10">
               <div className="print:mb-10 lg:col-span-2">
                 <HistorySection title="Riwayat Kenaikan Jenjang">
                    {profile.promotionHistory && profile.promotionHistory.length > 0 ? (
                        [...profile.promotionHistory].sort((a, b) => (parseInt(a.year, 10) || 0) - (parseInt(b.year, 10) || 0)).map(item => <PromHistoryItem key={item.id} item={item} />)
                    ) : (
                        <p className="text-sm text-gray-500 italic print:text-black">Tidak ada riwayat kenaikan jenjang yang tersedia.</p>
                    )}
                 </HistorySection>
               </div>

               <div className="print:mb-10">
                 <HistorySection title="Riwayat Sertifikasi Pengampuan">
                    {profile.developmentHistory && profile.developmentHistory.length > 0 ? (
                        [...profile.developmentHistory].sort((a, b) => (parseInt(a.year, 10) || 0) - (parseInt(b.year, 10) || 0)).map(item => <DevHistoryItem key={item.id} item={item} />)
                    ) : (
                        <p className="text-sm text-gray-500 italic print:text-black">Tidak ada riwayat sertifikasi pengampuan yang tersedia.</p>
                    )}
                 </HistorySection>
               </div>

               <div>
                 <HistorySection title="Riwayat Kompetensi">
                     {profile.performanceHistory && profile.performanceHistory.length > 0 ? (
                        [...profile.performanceHistory].sort((a, b) => (parseInt(a.year, 10) || 0) - (parseInt(b.year, 10) || 0)).map(item => <PerfHistoryItem key={item.id} item={item} />)
                    ) : (
                        <p className="text-sm text-gray-500 italic print:text-black">Tidak ada riwayat kompetensi yang tersedia.</p>
                    )}
                 </HistorySection>
               </div>
            </div>
          </div>
        </div>
      </div>
    
      
        {previewUrl && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:hidden">
                <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="font-semibold text-lg">Pratinjau Dokumen</h3>
                        <div className="flex items-center space-x-4">
                            <a 
                                href={previewUrl} 
                                download="dokumen" 
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors text-sm font-medium"
                            >
                                Unduh
                            </a>
                            <button 
                                onClick={() => {
                                    URL.revokeObjectURL(previewUrl);
                                    setPreviewUrl(null);
                                }} 
                                className="text-gray-500 hover:text-red-500 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4">
                        {previewType === 'image' ? (
                            <img src={previewUrl} alt="Dokumen" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <iframe src={previewUrl} className="w-full h-full border-none shadow-sm bg-white" title="Pratinjau PDF" />
                        )}
                    </div>
                </div>
            </div>
        )}

        {showQR && (
            <div className="fixed inset-0 z-[105] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:hidden" onClick={() => setShowQR(false)}>
                <div 
                    className="bg-white rounded-xl w-full max-w-sm flex flex-col shadow-2xl overflow-hidden relative p-8 items-center text-center space-y-6"
                    onClick={e => e.stopPropagation()}
                >
                    <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">QR Code Profil</h3>
                        <p className="text-sm text-gray-500 mt-1">Scan untuk melihat profil publik</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100" id="qr-code-container">
                        <QRCode value={profileUrl} size={200} level="H" />
                    </div>

                    <div className="space-y-1">
                        <p className="font-semibold text-gray-800">{profile.name}</p>
                        <p className="text-sm text-primary">{profile.tier}</p>
                    </div>

                    <button 
                        onClick={() => {
                            const printContent = document.getElementById('qr-code-container')?.innerHTML;
                            if (printContent) {
                                const printWindow = window.open('', '_blank');
                                if (printWindow) {
                                    printWindow.document.write(`
                                        <html>
                                            <head>
                                                <title>QR Code - ${profile.name}</title>
                                                <style>
                                                    body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
                                                    .name { font-size: 24px; font-weight: bold; margin-top: 20px; }
                                                    .tier { font-size: 18px; color: #666; margin-top: 5px; }
                                                </style>
                                            </head>
                                            <body>
                                                ${printContent}
                                                <div class="name">${profile.name}</div>
                                                <div class="tier">${profile.tier}</div>
                                                <script>window.onload = function() { window.print(); window.close(); }</script>
                                            </body>
                                        </html>
                                    `);
                                    printWindow.document.close();
                                }
                            }
                        }} 
                        className="w-full flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-secondary transition-all shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Cetak QR Code
                    </button>
                </div>
            </div>
        )}
</>
  );
};

export default ProfileDetailModal;
