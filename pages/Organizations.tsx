import React, { useState } from 'react';
import { useWidyaiswara } from '../contexts/WidyaiswaraContext';
import { ICONS } from '../constants';
import { JobTier } from '../types';

const Organizations: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { organizations } = useWidyaiswara();

    const filteredOrganizations = organizations.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => b.total - a.total);

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari instansi..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {ICONS.search}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-light-bg">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-text uppercase tracking-wider">Nama Instansi</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-medium-text uppercase tracking-wider">Ahli Pertama</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-medium-text uppercase tracking-wider">Ahli Muda</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-medium-text uppercase tracking-wider">Ahli Madya</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-medium-text uppercase tracking-wider">Ahli Utama</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-medium-text uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrganizations.map((org) => (
                                <tr key={org.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-dark-text">{org.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-medium-text">{org.widyaiswaraCount[JobTier.AhliPertama]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-medium-text">{org.widyaiswaraCount[JobTier.AhliMuda]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-medium-text">{org.widyaiswaraCount[JobTier.AhliMadya]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-medium-text">{org.widyaiswaraCount[JobTier.AhliUtama]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-primary">{org.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Organizations;
