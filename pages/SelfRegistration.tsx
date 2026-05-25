import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWidyaiswara } from '../contexts/WidyaiswaraContext';
import { useAuth } from '../contexts/AuthContext';
import { JobTier, PromotionHistoryItem, DevelopmentHistoryItem, PerformanceHistoryItem } from '../types';
import PromotionHistoryInput from '../components/PromotionHistoryInput';
import DevelopmentHistoryInput from '../components/DevelopmentHistoryInput';
import PerformanceHistoryInput from '../components/PerformanceHistoryInput';

const SelfRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { addProfile } = useWidyaiswara();
  const { isLoggedIn } = useAuth();

  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [niwn, setNiwn] = useState('');
  const [organization, setOrganization] = useState('');
  const [tier, setTier] = useState<JobTier>(JobTier.AhliPertama);
  const [creditPoints, setCreditPoints] = useState(0);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promotionHistory, setPromotionHistory] = useState<PromotionHistoryItem[]>([]);
  const [developmentHistory, setDevelopmentHistory] = useState<DevelopmentHistoryItem[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceHistoryItem[]>([]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-primary mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Akses Terbatas</h2>
        <p className="text-gray-600 mb-6">Anda harus login terlebih dahulu untuk melakukan Registrasi Mandiri dan menyimpan data profil Anda.</p>
        <Link to="/login" className="px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-secondary transition-colors">
          Login dengan Google
        </Link>
      </div>
    );
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const finalPromHistory = promotionHistory.filter(
      item => item.year.trim() !== '' || item.newTier.trim() !== '' || item.notes.trim() !== ''
    );

    const finalDevHistory = developmentHistory.filter(
      item => item.year.trim() !== '' || item.trainingName.trim() !== '' || item.organizer.trim() !== ''
    );

    const finalPerfHistory = performanceHistory.filter(
      item => item.year.trim() !== '' || item.performanceDescription.trim() !== ''
    );

    try {
      await addProfile({ 
        name, 
        nip, 
        niwn, 
        organization, 
        tier, 
        creditPoints: Number(creditPoints), 
        whatsappNumber,
        joinDate,
        photoUrl, 
        promotionHistory: finalPromHistory,
        developmentHistory: finalDevHistory,
        performanceHistory: finalPerfHistory
      });
      setIsSubmitting(false);
      alert('Data Anda berhasil dikirim. Terima kasih telah mendaftar.');
      navigate('/profiles');
    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      alert('Gagal menyimpan data: ' + (err.message || 'Harap periksa izin akses Anda.'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-primary mb-6">Registrasi Mandiri Widyaiswara</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap (dengan gelar)</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="nip" className="block text-sm font-medium text-gray-700">NIP</label>
                        <input type="text" id="nip" value={nip} onChange={e => setNip(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="niwn" className="block text-sm font-medium text-gray-700">NIWN</label>
                        <input type="text" id="niwn" value={niwn} onChange={e => setNiwn(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Instansi</label>
                        <input type="text" id="organization" value={organization} onChange={e => setOrganization(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="tier" className="block text-sm font-medium text-gray-700">Jenjang Jabatan</label>
                        <select id="tier" value={tier} onChange={e => setTier(e.target.value as JobTier)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm">
                            {Object.values(JobTier).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="creditPoints" className="block text-sm font-medium text-gray-700">Angka Kredit</label>
                        <input type="number" id="creditPoints" value={creditPoints} onChange={e => setCreditPoints(Number(e.target.value))} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">Nomor WA Aktif</label>
                        <input type="text" id="whatsappNumber" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} placeholder="08xxxxxxxxxx" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">Tanggal Bergabung</label>
                        <input type="date" id="joinDate" value={joinDate} onChange={e => setJoinDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                    </div>
                </div>

                <div className="border-t pt-6">
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Foto Profil</label>
                    <div className="mt-2 flex items-center space-x-6">
                        <span className="inline-block h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Pratinjau Foto" className="h-full w-full object-cover" />
                            ) : (
                                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </span>
                        <label htmlFor="photo-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">
                            <span>Unggah Foto</span>
                            <input id="photo-upload" name="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                        </label>
                    </div>
                </div>
                
                <PromotionHistoryInput history={promotionHistory} onChange={setPromotionHistory} />

                <DevelopmentHistoryInput history={developmentHistory} onChange={setDevelopmentHistory} />

                <PerformanceHistoryInput history={performanceHistory} onChange={setPerformanceHistory} />

                 <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400">
                        {isSubmitting ? 'Mengirim...' : 'Kirim Data'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default SelfRegistration;