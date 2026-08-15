import { useToast } from '../contexts/ToastContext';
import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { ICONS } from '../constants';

const FlyerSection: React.FC = () => {
  const { showToast } = useToast();
  const { isAdmin } = useAuth();
  const [flyerUrl, setFlyerUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchFlyer = async () => {
      try {
        const docRef = doc(db, 'settings', 'competency_flyer');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFlyerUrl(docSnap.data().url);
        }
      } catch (error) {
        console.error("Error fetching flyer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlyer();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Ukuran gambar terlalu besar. Maksimal 2MB.", 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFlyerUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'settings', 'competency_flyer');
      await setDoc(docRef, { url: flyerUrl });
      setIsEditing(false);
      showToast("Flyer berhasil disimpan!", 'success');
    } catch (error) {
      console.error("Error saving flyer:", error);
      showToast("Gagal menyimpan flyer.", 'error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus flyer ini?")) {
      try {
        const docRef = doc(db, 'settings', 'competency_flyer');
        await setDoc(docRef, { url: null });
        setFlyerUrl(null);
        setIsEditing(false);
      } catch (error) {
        console.error("Error deleting flyer:", error);
      }
    }
  };

  if (loading) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-dark-text">Mekanisme & Persyaratan Uji Kompetensi</h2>
        {isAdmin && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center"
          >
            {ICONS.edit} <span className="ml-2">{isEditing ? 'Batal Edit' : 'Edit Flyer'}</span>
          </button>
        )}
      </div>

      {isEditing && isAdmin ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Pilih Gambar Flyer
            </button>
            <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG. Maksimal 2MB.</p>
          </div>
          
          {flyerUrl && (
            <div className="relative inline-block mt-4 max-w-full">
              <img src={flyerUrl} alt="Flyer Preview" className="max-w-full h-auto rounded-lg shadow-sm max-h-[500px] object-contain" />
              <button
                onClick={handleDelete}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
                title="Hapus Flyer"
              >
                {ICONS.trash}
              </button>
            </div>
          )}
          
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      ) : flyerUrl ? (
        <div className="flex justify-center">
          <img src={flyerUrl} alt="Mekanisme & Persyaratan Uji Kompetensi" className="max-w-full h-auto rounded-lg shadow-sm" />
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          Belum ada informasi flyer Mekanisme & Persyaratan.
        </div>
      )}
    </div>
  );
};

export default FlyerSection;
