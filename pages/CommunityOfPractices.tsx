import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

import { useToast } from '../contexts/ToastContext';
import { ICONS } from '../constants';
import { CopEvent } from '../types';

const CommunityOfPractices: React.FC = () => {
    const { isAdmin } = useAuth();
    const { showToast } = useToast();
    const [events, setEvents] = useState<CopEvent[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CopEvent | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '', speaker: '' });

    useEffect(() => {
        const q = query(collection(db, 'cop_events'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: CopEvent[] = [];
            snapshot.forEach(doc => data.push(doc.data() as CopEvent));
            setEvents(data);
            setLoading(false);
        }, (error) => {
            console.error("CoP fetch error:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const id = editingEvent ? editingEvent.id : doc(collection(db, 'cop_events')).id;
            const dateTimestamp = new Date(formData.date).getTime();
            const payload: CopEvent = {
                id,
                title: formData.title,
                description: formData.description,
                date: dateTimestamp,
                location: formData.location,
                speaker: formData.speaker || '',
                createdAt: editingEvent ? editingEvent.createdAt : Date.now()
            };

            console.log('Saving payload:', payload);
            await setDoc(doc(db, 'cop_events', id), payload);
            
            // Sync with Agenda if it's new, or we can just let DevelopmentHub fetch cop_events too. Let's just fetch them in DevHub.
            
            showToast(`Kegiatan CoP berhasil ${editingEvent ? 'diperbarui' : 'ditambahkan'}`, 'success');
            setIsModalOpen(false);
        } catch (error: any) {
            showToast('Gagal menyimpan kegiatan: ' + error.message, 'error'); console.error('CoP Save Error:', error);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (window.confirm(`Hapus kegiatan CoP "${title}"?`)) {
            try {
                await deleteDoc(doc(db, 'cop_events', id));
                showToast('Kegiatan berhasil dihapus', 'success');
            } catch (error) {
                showToast('Gagal menghapus kegiatan', 'error');
            }
        }
    };

    const openAdd = () => {
        setEditingEvent(null);
        setFormData({ title: '', description: '', date: '', location: '', speaker: '' });
        setIsModalOpen(true);
    };

    const openEdit = (ev: CopEvent) => {
        setEditingEvent(ev);
        const dateStr = new Date(ev.date).toISOString().split('T')[0];
        setFormData({ title: ev.title, description: ev.description, date: dateStr, location: ev.location, speaker: ev.speaker || '' });
        setIsModalOpen(true);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Community of Practices (CoP)</h1>
                    <p className="text-medium-text mt-2">Wadah berbagi pengetahuan dan pengalaman Widyaiswara melalui Sharing Session.</p>
                </div>
                {isAdmin && (
                    <button onClick={openAdd} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors">
                        + Tambah Kegiatan
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm text-gray-500">
                        Belum ada jadwal kegiatan CoP.
                    </div>
                ) : (
                    events.map(ev => (
                        <div key={ev.id} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent relative group">
                            <h3 className="text-xl font-bold text-dark-text mb-2">{ev.title}</h3>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <p className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> {new Date(ev.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> {ev.location}</p>
                                {ev.speaker && <p className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> Narasumber: {ev.speaker}</p>}
                            </div>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{ev.description}</p>
                            
                            {isAdmin && (
                                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-md shadow-sm">
                                    <button onClick={() => openEdit(ev)} className="p-1 text-gray-500 hover:text-primary"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg></button>
                                    <button onClick={() => handleDelete(ev.id, ev.title)} className="p-1 text-gray-500 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSave}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">{editingEvent ? 'Edit Kegiatan CoP' : 'Tambah Kegiatan CoP'}</h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Topik / Judul</label>
                                            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                                            <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Lokasi / Tautan</label>
                                            <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Narasumber (Opsional)</label>
                                            <input type="text" value={formData.speaker} onChange={e => setFormData({...formData, speaker: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Deskripsi / Detail</label>
                                            <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">Simpan</button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Batal</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default CommunityOfPractices;
