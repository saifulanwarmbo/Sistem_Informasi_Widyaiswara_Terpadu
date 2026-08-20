import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { motion } from 'motion/react';
import DashboardCard from '../components/DashboardCard';
import { ICONS } from '../constants';
import { useWidyaiswara } from '../contexts/WidyaiswaraContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { JobTier } from '../types';


const SkeletonDashboard = () => (
    <div className="space-y-8 animate-pulse print:hidden">
        <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 md:w-1/4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
        
        {/* Profile Completion Skeleton */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-gray-300 dark:border-gray-600">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>)}
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-4"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"></div>
                    <div className="flex-1">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-[400px] flex flex-col">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                    <div className="flex-1 flex justify-center items-center">
                        {i === 1 ? (
                            <div className="h-48 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        ) : (
                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { profiles, organizations, isLoading } = useWidyaiswara();
    const { user } = useAuth();

    const currentUserProfile = useMemo(() => {
        return profiles.find(p => p.ownerId === user?.uid);
    }, [profiles, user]);

    const profileCompleteness = useMemo(() => {
        if (!currentUserProfile) return null;

        const checks = [
            { label: 'Informasi Dasar', isComplete: !!(currentUserProfile.nip && currentUserProfile.niwn && currentUserProfile.organization) },
            { label: 'Kontak WhatsApp', isComplete: !!currentUserProfile.whatsappNumber },
            { label: 'Riwayat Kenaikan Jenjang', isComplete: !!(currentUserProfile.promotionHistory && currentUserProfile.promotionHistory.length > 0) },
            { label: 'Riwayat Sertifikasi Pengampuan', isComplete: !!(currentUserProfile.developmentHistory && currentUserProfile.developmentHistory.length > 0) },
            { label: 'Riwayat Kompetensi', isComplete: !!(currentUserProfile.performanceHistory && currentUserProfile.performanceHistory.length > 0) },
        ];

        const completed = checks.filter(c => c.isComplete).length;
        const total = checks.length;
        const percentage = Math.round((completed / total) * 100);

        return {
            percentage,
            checks
        };
    }, [currentUserProfile]);






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

    if (isLoading) {
        return <SkeletonDashboard />;
    }

    return (
        <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <div className="flex justify-between items-center print:hidden">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard Statistik</h1>
                <button 
                    onClick={() => window.print()}
                    className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    <span>Cetak Laporan</span>
                </button>
            </div>
            {/* Profile Completion Widget */}
            {profileCompleteness && profileCompleteness.percentage < 100 && (
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-lg transition-colors duration-200 shadow-md border-l-4 border-yellow-500 print:hidden">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Lengkapi Profil Anda</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Profil yang lengkap membantu validasi kompetensi Anda.</p>
                        </div>
                        <span className="mt-2 md:mt-0 px-3 py-1 bg-yellow-100 text-yellow-800 font-semibold rounded-full text-sm">
                            {profileCompleteness.percentage}% Selesai
                        </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
                        <div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${profileCompleteness.percentage}%` }}></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {profileCompleteness.checks.map((check, index) => (
                            <div key={index} className="flex items-center text-sm">
                                {check.isComplete ? (
                                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                )}
                                <span className={check.isComplete ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}>{check.label}</span>
                            </div>
                        ))}
                    </div>

                    <Link to="/input-data" className="inline-block mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors text-sm font-medium shadow-sm">
                        Lengkapi Sekarang
                    </Link>
                </motion.div>
            )}

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
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-lg transition-colors duration-200 shadow-md">
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
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 p-6 rounded-lg transition-colors duration-200 shadow-md flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Top 5 Instansi dengan Widyaiswara Terbanyak</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
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