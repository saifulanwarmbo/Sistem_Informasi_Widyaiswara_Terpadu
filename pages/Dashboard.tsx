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
    const totalPertama = profiles.filter(p => p.tier === JobTier.AhliPertama).length;
    const totalMuda = profiles.filter(p => p.tier === JobTier.AhliMuda).length;
    const totalMadya = profiles.filter(p => p.tier === JobTier.AhliMadya).length;
    const totalUtama = profiles.filter(p => p.tier === JobTier.AhliUtama).length;
    
    const totalPengembanganProfesi = useMemo(() => {
        return profiles.reduce((acc, profile) => acc + (profile.developmentHistory?.length || 0), 0);
    }, [profiles]);

    const chartDataTierDistribution = useMemo(() => [
      { name: 'Pertama', value: totalPertama, fill: '#4DD0E1' },
      { name: 'Muda', value: totalMuda, fill: '#4DB6AC' },
      { name: 'Madya', value: totalMadya, fill: '#81C784' },
      { name: 'Utama', value: totalUtama, fill: '#AED581' },
    ], [totalPertama, totalMuda, totalMadya, totalUtama]);

    const organizationData = useMemo(() => organizations.map(org => ({
        name: org.name,
        ...org.widyaiswaraCount,
        total: org.total,
    })).sort((a, b) => b.total - a.total).slice(0, 5), [organizations]);
    
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
                <DashboardCard title="Total Pengembangan Profesi" value={totalPengembanganProfesi.toString()} icon={ICONS.development} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard title="Ahli Utama" value={totalUtama.toString()} icon={ICONS.star} color="bg-yellow-500" />
                <DashboardCard title="Ahli Madya" value={totalMadya.toString()} icon={ICONS.tiers} color="bg-teal-500" />
                <DashboardCard title="Ahli Muda" value={totalMuda.toString()} icon={ICONS.tiers} color="bg-cyan-500" />
                <DashboardCard title="Ahli Pertama" value={totalPertama.toString()} icon={ICONS.tiers} color="bg-blue-400" />
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

                {/* Organization Bar Chart */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Top 5 Instansi dengan Widyaiswara Terbanyak</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={organizationData} margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey={JobTier.AhliPertama as string} stackId="a" fill="#4DD0E1" name="Pertama" />
                                <Bar dataKey={JobTier.AhliMuda as string} stackId="a" fill="#4DB6AC" name="Muda" />
                                <Bar dataKey={JobTier.AhliMadya as string} stackId="a" fill="#81C784" name="Madya" />
                                <Bar dataKey={JobTier.AhliUtama as string} stackId="a" fill="#AED581" name="Utama" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;