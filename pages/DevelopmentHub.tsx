import { useToast } from '../contexts/ToastContext';
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { DevelopmentResource, Agenda } from '../types';
import { logAdminAction } from '../utils/auditLogger';

const DevelopmentHub: React.FC = () => {
  const { showToast } = useToast();
    const { isAdmin, user } = useAuth();
    
    const [resources, setResources] = useState<DevelopmentResource[]>([]);
    const [agendas, setAgendas] = useState<Agenda[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state for Resource
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<DevelopmentResource | null>(null);
    const [resourceForm, setResourceForm] = useState({ title: '', description: '', link: '' });

    // Modal state for Agenda
    const [isAgendaModalOpen, setIsAgendaModalOpen] = useState(false);
    const [editingAgenda, setEditingAgenda] = useState<Agenda | null>(null);
    const [agendaForm, setAgendaForm] = useState({ title: '', date: '', location: '' });

    useEffect(() => {
        const resourcesQuery = query(collection(db, 'developmentResources'), orderBy('createdAt', 'desc'));
        const unsubscribeResources = onSnapshot(resourcesQuery, (snapshot) => {
            const data: DevelopmentResource[] = [];
            snapshot.forEach(doc => data.push(doc.data() as DevelopmentResource));
            setResources(data);
        });

        const agendasQuery = query(collection(db, 'agendas'), orderBy('date', 'asc'));
        const unsubscribeAgendas = onSnapshot(agendasQuery, (snapshot) => {
            const data: Agenda[] = [];
            snapshot.forEach(doc => data.push(doc.data() as Agenda));
            setAgendas(data);
            setLoading(false);
        });

        return () => {
            unsubscribeResources();
            unsubscribeAgendas();
        };
    }, []);

    const handleSaveResource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin || !user) return;
        
        try {
            const id = editingResource?.id || doc(collection(db, 'developmentResources')).id;
            const resourceData: DevelopmentResource = {
                id,
                title: resourceForm.title,
                description: resourceForm.description,
                link: resourceForm.link,
                createdAt: editingResource?.createdAt || Date.now()
            };
            
            await setDoc(doc(db, 'developmentResources', id), resourceData);
            
            await logAdminAction(
                user.uid,
                user.email || 'Unknown',
                editingResource ? 'UPDATE_RESOURCE' : 'CREATE_RESOURCE',
                id,
                `Resource: ${resourceData.title}`
            );
            
            setIsResourceModalOpen(false);
            setEditingResource(null);
            setResourceForm({ title: '', description: '', link: '' });
        } catch (error) {
            console.error("Error saving resource:", error);
            showToast("Gagal menyimpan resource.", 'error');
        }
    };

    const handleDeleteResource = async (id: string, title: string) => {
        if (!isAdmin || !user) return;
        if (!window.confirm(`Hapus resource "${title}"?`)) return;
        
        try {
            await deleteDoc(doc(db, 'developmentResources', id));
            await logAdminAction(user.uid, user.email || 'Unknown', 'DELETE_RESOURCE', id, `Resource: ${title}`);
        } catch (error) {
            console.error("Error deleting resource:", error);
            showToast("Gagal menghapus resource.", 'error');
        }
    };

    const handleSaveAgenda = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin || !user) return;
        
        try {
            const id = editingAgenda?.id || doc(collection(db, 'agendas')).id;
            const agendaData: Agenda = {
                id,
                title: agendaForm.title,
                date: new Date(agendaForm.date).getTime(),
                location: agendaForm.location,
                createdAt: editingAgenda?.createdAt || Date.now()
            };
            
            await setDoc(doc(db, 'agendas', id), agendaData);
            
            await logAdminAction(
                user.uid,
                user.email || 'Unknown',
                editingAgenda ? 'UPDATE_AGENDA' : 'CREATE_AGENDA',
                id,
                `Agenda: ${agendaData.title}`
            );
            
            setIsAgendaModalOpen(false);
            setEditingAgenda(null);
            setAgendaForm({ title: '', date: '', location: '' });
        } catch (error) {
            console.error("Error saving agenda:", error);
            showToast("Gagal menyimpan agenda.", 'error');
        }
    };

    const handleDeleteAgenda = async (id: string, title: string) => {
        if (!isAdmin || !user) return;
        if (!window.confirm(`Hapus agenda "${title}"?`)) return;
        
        try {
            await deleteDoc(doc(db, 'agendas', id));
            await logAdminAction(user.uid, user.email || 'Unknown', 'DELETE_AGENDA', id, `Agenda: ${title}`);
        } catch (error) {
            console.error("Error deleting agenda:", error);
            showToast("Gagal menghapus agenda.", 'error');
        }
    };

    const openEditResource = (resource: DevelopmentResource) => {
        setEditingResource(resource);
        setResourceForm({ title: resource.title, description: resource.description, link: resource.link });
        setIsResourceModalOpen(true);
    };

    const openEditAgenda = (agenda: Agenda) => {
        setEditingAgenda(agenda);
        // format date for input type="date"
        const dateObj = new Date(agenda.date);
        const dateStr = dateObj.toISOString().split('T')[0];
        setAgendaForm({ title: agenda.title, date: dateStr, location: agenda.location });
        setIsAgendaModalOpen(true);
    };

    const openAddResource = () => {
        setEditingResource(null);
        setResourceForm({ title: '', description: '', link: '' });
        setIsResourceModalOpen(true);
    };

    const openAddAgenda = () => {
        setEditingAgenda(null);
        setAgendaForm({ title: '', date: '', location: '' });
        setIsAgendaModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-primary">Pusat Pengembangan Profesi</h2>
                <p className="mt-2 text-lg text-medium-text">Sumber daya untuk meningkatkan kompetensi dan profesionalisme Widyaiswara.</p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-dark-text border-b pb-2">Materi & Pedoman</h3>
                    {isAdmin && (
                        <button onClick={openAddResource} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark">
                            + Tambah Materi
                        </button>
                    )}
                </div>
                
                {resources.length === 0 ? (
                    <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500">
                        Belum ada materi atau pedoman yang dipublikasikan.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {resources.map((resource) => (
                            <div key={resource.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-lg font-semibold text-dark-text">{resource.title}</h4>
                                    <p className="mt-2 text-medium-text">{resource.description}</p>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="inline-block text-secondary font-semibold hover:underline">
                                        Pelajari Lebih Lanjut &rarr;
                                    </a>
                                    {isAdmin && (
                                        <div className="flex space-x-2">
                                            <button onClick={() => openEditResource(resource)} className="text-gray-500 hover:text-primary">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                                            </button>
                                            <button onClick={() => handleDeleteResource(resource.id, resource.title)} className="text-gray-500 hover:text-red-500">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-xl font-bold text-dark-text">Agenda Mendatang</h3>
                    {isAdmin && (
                        <button onClick={openAddAgenda} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark">
                            + Tambah Agenda
                        </button>
                    )}
                </div>
                
                {agendas.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                        Belum ada agenda mendatang.
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {agendas.map((agenda) => {
                            const dateObj = new Date(agenda.date);
                            const day = dateObj.getDate();
                            const month = dateObj.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
                            
                            return (
                                <li key={agenda.id} className="flex items-start justify-between group">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 bg-secondary text-white rounded-md text-center w-20 p-2">
                                            <span className="block text-2xl font-bold">{day}</span>
                                            <span className="block text-sm">{month}</span>
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold text-lg">{agenda.title}</p>
                                            <p className="text-sm text-medium-text mt-1">{agenda.location}</p>
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditAgenda(agenda)} className="text-gray-500 hover:text-primary">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                                            </button>
                                            <button onClick={() => handleDeleteAgenda(agenda.id, agenda.title)} className="text-gray-500 hover:text-red-500">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* Resource Modal */}
            {isResourceModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsResourceModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSaveResource}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        {editingResource ? 'Edit Materi & Pedoman' : 'Tambah Materi & Pedoman'}
                                    </h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label htmlFor="res-title" className="block text-sm font-medium text-gray-700">Judul</label>
                                            <input type="text" id="res-title" required value={resourceForm.title} onChange={e => setResourceForm({...resourceForm, title: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="res-desc" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                            <textarea id="res-desc" required rows={3} value={resourceForm.description} onChange={e => setResourceForm({...resourceForm, description: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"></textarea>
                                        </div>
                                        <div>
                                            <label htmlFor="res-link" className="block text-sm font-medium text-gray-700">Tautan (URL)</label>
                                            <input type="url" id="res-link" required value={resourceForm.link} onChange={e => setResourceForm({...resourceForm, link: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">
                                        Simpan
                                    </button>
                                    <button type="button" onClick={() => setIsResourceModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Agenda Modal */}
            {isAgendaModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsAgendaModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSaveAgenda}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        {editingAgenda ? 'Edit Agenda' : 'Tambah Agenda'}
                                    </h3>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label htmlFor="ag-title" className="block text-sm font-medium text-gray-700">Judul Agenda</label>
                                            <input type="text" id="ag-title" required value={agendaForm.title} onChange={e => setAgendaForm({...agendaForm, title: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="ag-date" className="block text-sm font-medium text-gray-700">Tanggal</label>
                                            <input type="date" id="ag-date" required value={agendaForm.date} onChange={e => setAgendaForm({...agendaForm, date: e.target.value})} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="ag-location" className="block text-sm font-medium text-gray-700">Lokasi / Keterangan Waktu</label>
                                            <input type="text" id="ag-location" required value={agendaForm.location} onChange={e => setAgendaForm({...agendaForm, location: e.target.value})} placeholder="Pusdiklat LAN, Jakarta | 09:00 WIB" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">
                                        Simpan
                                    </button>
                                    <button type="button" onClick={() => setIsAgendaModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevelopmentHub;
