import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { AuditLog } from '../types';
import { ICONS } from '../constants';

const AuditLogs: React.FC = () => {
    const { isAdmin } = useAuth();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAdmin) {
            fetchLogs();
        }
    }, [isAdmin]);

    const fetchLogs = async () => {
        setLoading(true);
        setError('');
        try {
            const q = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(100));
            const querySnapshot = await getDocs(q);
            const logsData: AuditLog[] = [];
            querySnapshot.forEach((doc) => {
                logsData.push(doc.data() as AuditLog);
            });
            setLogs(logsData);
        } catch (err: any) {
            console.error("Error fetching audit logs:", err);
            setError('Gagal memuat log audit. ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return <div className="p-4 text-red-500">Akses ditolak. Halaman ini hanya untuk admin.</div>;
    }

    const formatAction = (action: string) => {
        return action.replace(/_/g, ' ').toUpperCase();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
                <div>
                    <h2 className="text-2xl font-bold text-dark-text">Audit Log</h2>
                    <p className="text-gray-600">Lacak modifikasi yang dilakukan oleh Admin pada sistem.</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    <span>Refresh</span>
                </button>
            </div>

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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                            Belum ada log audit.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(log.timestamp).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {log.adminEmail}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {formatAction(log.action)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">
                                                {log.targetId}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={log.details}>
                                                {log.details || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditLogs;
