import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { AppUser, UserRole } from '../types';

const ManageAdmins: React.FC = () => {
    const { isAdmin } = useAuth();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const q = query(collection(db, 'users'));
            const querySnapshot = await getDocs(q);
            const usersData: AppUser[] = [];
            querySnapshot.forEach((doc) => {
                usersData.push(doc.data() as AppUser);
            });
            setUsers(usersData);
        } catch (err: any) {
            console.error("Error fetching users:", err);
            setError('Gagal memuat data pengguna.');
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = async (user: AppUser) => {
        try {
            // Protect default admin from being demoted
            if (user.email === 'saiful.anwarmbo@gmail.com') {
                alert('Admin utama tidak dapat diubah perannya.');
                return;
            }

            const newRole: UserRole = user.role === 'admin' ? 'widyaiswara' : 'admin';
            if (!window.confirm(`Apakah Anda yakin ingin mengubah peran ${user.email} menjadi ${newRole}?`)) {
                return;
            }

            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, { role: newRole });
            
            // Update local state
            setUsers(prev => prev.map(u => 
                u.id === user.id ? { ...u, role: newRole } : u
            ));
        } catch (err) {
            console.error("Error updating user role:", err);
            alert('Gagal memperbarui peran pengguna.');
        }
    };

    if (!isAdmin) {
        return <div className="p-4 text-red-500">Akses ditolak. Halaman ini hanya untuk admin.</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-dark-text border-b pb-2">Kelola Pembantu Admin</h2>
            <p className="text-gray-600">
                Di sini Anda dapat memberikan atau mencabut akses admin kepada pengguna lain (pembantu admin) untuk membantu mengelola data SIWITA.
            </p>

            {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

            {loading ? (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peran Saat Ini</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {user.email !== 'saiful.anwarmbo@gmail.com' ? (
                                                <button
                                                    onClick={() => toggleRole(user)}
                                                    className={`px-3 py-1 rounded-md text-white text-xs ${user.role === 'admin' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                                >
                                                    {user.role === 'admin' ? 'Cabut Akses Admin' : 'Jadikan Admin'}
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">Admin Utama</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAdmins;
