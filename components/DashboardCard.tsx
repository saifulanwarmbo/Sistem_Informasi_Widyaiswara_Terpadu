
import React from 'react';
import { motion } from 'motion/react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between transition-colors duration-200"
    >
      <div>
        <p className="text-sm font-medium text-medium-text dark:text-gray-400 uppercase">{title}</p>
        <p className="text-3xl font-bold text-dark-text dark:text-gray-100">{value}</p>
      </div>
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
    </motion.div>
  );
};

export default React.memo(DashboardCard);
