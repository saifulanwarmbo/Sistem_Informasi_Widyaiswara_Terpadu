import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompetency } from '../contexts/CompetencyContext';
import { useWidyaiswara } from '../contexts/WidyaiswaraContext';
import { useAuth } from '../contexts/AuthContext';
import { ICONS } from '../constants';

const CompetencyTest: React.FC = () => {
  const { registrations, submitRegistration } = useCompetency();
  const { profiles } = useWidyaiswara();
  const { user, isLoggedIn } = useAuth();

  const [docName, setDocName] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [documents, setDocuments] = useState<{name: string, url: string}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-primary mb-4">
          {ICONS.document}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Akses Terbatas</h2>
        <p className="text-gray-600 mb-6">Anda harus login terlebih dahulu untuk mengajukan atau melihat status Uji Kompetensi Anda.</p>
        <Link to="/login" className="px-6 py-2 bg-primary text-white font-medium rounded-md hover:bg-secondary transition-colors">
          Login dengan Google
        </Link>
      </div>
    );
  }

  // Find user's profile
  const userProfile = profiles.find(p => p.ownerId === user?.uid);
  
  // Find user's registration
  const userRegistration = registrations.find(r => r.ownerId === user?.uid);

  const handleAddDocument = () => {
    if (docName && docUrl) {
      setDocuments([...documents, { name: docName, url: docUrl }]);
      setDocName('');
      setDocUrl('');
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      alert("Anda harus membuat profil Widyaiswara terlebih dahulu.");
      return;
    }
    if (documents.length === 0) {
      alert("Silakan tambahkan minimal satu dokumen persyaratan.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRegistration({
        profileId: userProfile.id,
        ownerId: user!.uid,
        status: 'pending',
        documents: documents,
        submissionDate: Date.now()
      });
      alert("Pendaftaran Uji Kompetensi berhasil dikirim!");
    } catch (error) {
      console.error("Error submitting registration", error);
      alert("Terjadi kesalahan saat mengirim pendaftaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-dark-text mb-4">Uji Kompetensi Widyaiswara</h2>
        <p className="text-medium-text mb-6">Anda belum memiliki profil Widyaiswara. Silakan buat profil Anda terlebih dahulu di menu Registrasi Mandiri.</p>
      </div>
    );
  }

  if (userRegistration) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-dark-text mb-6">Status Pendaftaran Uji Kompetensi</h2>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Status Saat Ini</p>
          <div className="flex items-center space-x-2">
            {userRegistration.status === 'pending' && <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold">Menunggu Verifikasi</span>}
            {userRegistration.status === 'verified' && <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold">Disetujui</span>}
            {userRegistration.status === 'rejected' && <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold">Ditolak</span>}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Tanggal Pengajuan</p>
          <p className="text-dark-text font-medium">{new Date(userRegistration.submissionDate).toLocaleDateString('id-ID')}</p>
        </div>

        {userRegistration.adminNotes && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Catatan Admin</p>
            <p className="text-dark-text">{userRegistration.adminNotes}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Dokumen Terlampir</p>
          <ul className="space-y-2">
            {userRegistration.documents.map((doc, index) => (
              <li key={index} className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                {ICONS.document}
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="underline">{doc.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-dark-text mb-6">Pendaftaran Uji Kompetensi</h2>
      <p className="text-medium-text mb-6">
        Silakan lengkapi dokumen persyaratan untuk mengikuti Uji Kompetensi Widyaiswara.
        Gunakan tautan (link) Google Drive atau layanan penyimpanan awan lainnya untuk dokumen Anda.
        Pastikan tautan dapat diakses oleh publik (Anyone with the link).
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Tambah Dokumen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Dokumen</label>
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Contoh: SK Pangkat Terakhir"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tautan (URL)</label>
              <input
                type="url"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddDocument}
            disabled={!docName || !docUrl}
            className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Tambah Dokumen
          </button>
        </div>

        {documents.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Daftar Dokumen</h3>
            <ul className="space-y-2">
              {documents.map((doc, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm">
                  <div className="flex items-center space-x-2 truncate mr-4">
                    <span className="text-gray-500">{ICONS.document}</span>
                    <span className="font-medium truncate">{doc.name}</span>
                    <span className="text-sm text-gray-400 truncate">({doc.url})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    {ICONS.trash}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting || documents.length === 0}
            className="w-full px-4 py-3 bg-primary text-white font-bold rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompetencyTest;
