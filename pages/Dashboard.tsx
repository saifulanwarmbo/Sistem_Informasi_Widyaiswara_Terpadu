import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { motion } from 'motion/react';
import DashboardCard from '../components/DashboardCard';
import { ICONS } from '../constants';
import { useWidyaiswara } from '../contexts/WidyaiswaraContext';
import { JobTier } from '../types';

const Dashboard: React.FC = () => {
    const { profiles, organizations } = useWidyaiswara();

    const totalWidyaiswara = profiles.length;
    const totalOrganizations = organizations.filter(org => org.total > 0).length;
    const topTierCount = profiles.filter(p => p.tier === JobTier.AhliUtama).length;

    const chartDataTierDistribution = [
      { name: 'Pertama', value: profiles.filter(p => p.tier === JobTier.AhliPertama).length, fill: '#4DD0E1' },
      { name: 'Muda', value: profiles.filter(p => p.tier === JobTier.AhliMuda).length, fill: '#4DB6AC' },
      { name: 'Madya', value: profiles.filter(p => p.tier === JobTier.AhliMadya).length, fill: '#81C784' },
      { name: 'Utama', value: profiles.filter(p => p.tier === JobTier.AhliUtama).length, fill: '#AED581' },
    ];

    const organizationData = organizations.map(org => ({
        name: org.name,
        ...org.widyaiswaraCount,
        total: org.total,
    })).sort((a, b) => b.total - a.total).slice(0, 5);
    
    const widyaiswaraGrowthData = useMemo(() => {
        if (!profiles || profiles.length === 0) {
            return [];
        }

        const yearlyAdditions = profiles.reduce((acc, profile) => {
            if (profile.createdAt) {
                const year = new Date(profile.createdAt).getFullYear().toString();
                acc[year] = (acc[year] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const sortedYears = Object.keys(yearlyAdditions).sort();

        if (sortedYears.length === 0) {
            return [];
        }

        let cumulativeCount = 0;
        const cumulativeData = sortedYears.map(year => {
            cumulativeCount += yearlyAdditions[year];
            return { year: year, count: cumulativeCount };
        });

        return cumulativeData;
    }, [profiles]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard title="Total Widyaiswara" value={totalWidyaiswara.toString()} icon={ICONS.users} color="bg-blue-500" />
                <DashboardCard title="Total Instansi Aktif" value={totalOrganizations.toString()} icon={ICONS.building} color="bg-green-500" />
                <DashboardCard title="Widyaiswara Ahli Utama" value={topTierCount.toString()} icon={ICONS.star} color="bg-yellow-500" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tier Distribution Pie Chart */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Distribusi Jenjang Jabatan</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartDataTierDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {chartDataTierDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                             <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Growth Line Chart */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Pertumbuhan Jumlah Widyaiswara</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         {widyaiswaraGrowthData.length > 0 ? (
                            <LineChart data={widyaiswaraGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#1565C0" name="Total Kumulatif" activeDot={{ r: 8 }} />
                            </LineChart>
                        ) : (
                            <div className="flex items-center justify-center h-full text-center text-medium-text">
                                <p>Data pertumbuhan akan ditampilkan di sini<br/>setelah ada beberapa profil yang ditambahkan.</p>
                            </div>
                        )}
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Organization Bar Chart */}
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Top 5 Instansi dengan Widyaiswara Terbanyak</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart layout="vertical" data={organizationData} margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={JobTier.AhliPertama} stackId="a" fill="#4DD0E1" name="Pertama" />
                        <Bar dataKey={JobTier.AhliMuda} stackId="a" fill="#4DB6AC" name="Muda" />
                        <Bar dataKey={JobTier.AhliMadya} stackId="a" fill="#81C784" name="Madya" />
                        <Bar dataKey={JobTier.AhliUtama} stackId="a" fill="#AED581" name="Utama" />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;