
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
      className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between"
    >
      <div>
        <p className="text-sm font-medium text-medium-text uppercase">{title}</p>
        <p className="text-3xl font-bold text-dark-text">{value}</p>
      </div>
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
