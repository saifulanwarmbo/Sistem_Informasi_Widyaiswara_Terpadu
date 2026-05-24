
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { JobTier } from '../types';
import { useWidyaiswara } from '../contexts/WidyaiswaraContext';

const JobTiers: React.FC = () => {
  const { profiles } = useWidyaiswara();

  const tierData = Object.values(JobTier).map(tier => {
    const count = profiles.filter(p => p.tier === tier).length;
    let minCredit = 0;
    let color = '';
    switch(tier) {
        case JobTier.AhliPertama: minCredit = 100; color = '#4DD0E1'; break;
        case JobTier.AhliMuda: minCredit = 200; color = '#4DB6AC'; break;
        case JobTier.AhliMadya: minCredit = 400; color = '#81C784'; break;
        case JobTier.AhliUtama: minCredit = 850; color = '#AED581'; break;
    }
    return {
        name: tier,
        'Jumlah Widyaiswara': count,
        'Minimal Angka Kredit': minCredit,
        fill: color
    }
  });

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-dark-text">Distribusi Widyaiswara per Jenjang Jabatan</h3>
         <ResponsiveContainer width="100%" height={400}>
            <BarChart data={tierData} margin={{ top: 5, right: 30, left: 20, bottom: 5, }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Jumlah Widyaiswara" fill="#1565C0" />
            </BarChart>
        </ResponsiveContainer>
      </div>

       <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-dark-text">Detail Jenjang Jabatan</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-light-bg">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-text uppercase tracking-wider">Jenjang Jabatan</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-text uppercase tracking-wider">Jumlah</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-text uppercase tracking-wider">Minimal Angka Kredit Kumulatif</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tierData.map((tier) => (
                    <tr key={tier.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="h-2.5 w-2.5 rounded-full mr-3" style={{backgroundColor: tier.fill}}></div>
                                {tier.name}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-dark-text">{tier['Jumlah Widyaiswara']}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-medium-text">{tier['Minimal Angka Kredit']}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default JobTiers;