const fs = require('fs');
let file = fs.readFileSync('pages/Dashboard.tsx', 'utf8');

const target = `    return (
        <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {/* Profile Completion Widget */}`;

const replacement = `    return (
        <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <div className="flex justify-between items-center print:hidden">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Statistik</h1>
                <button 
                    onClick={() => window.print()}
                    className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    <span>Cetak Laporan</span>
                </button>
            </div>
            {/* Profile Completion Widget */}`;

file = file.replace(target, replacement);

const target2 = `<motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">`;
const replacement2 = `<motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 print:hidden">`;

file = file.replace(target2, replacement2);

fs.writeFileSync('pages/Dashboard.tsx', file);
