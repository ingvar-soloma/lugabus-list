import React from 'react';
import { useAppContext } from '../store/AppContext';
import { ThemeClasses } from '../types';
import { motion } from 'framer-motion';

interface StatsBarProps {
  isDarkMode: boolean;
  themeClasses: ThemeClasses;
}

const StatsBar: React.FC<StatsBarProps> = ({ isDarkMode, themeClasses }) => {
  const { stats } = useAppContext();

  if (!stats) return null;

  const statItems = [
    { label: 'ОСІБ У РЕЄСТРІ', value: stats.totalMonitored.toLocaleString() },
    { label: 'ЗРАДНИКИ', value: stats.betrayalCount.toLocaleString() },
    { label: 'ПІДТВЕРДЖЕНІ ДОКАЗИ', value: (stats.totalMonitored * 4).toLocaleString() }, // Mocking proofs count as total * 4 for now
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-12">
      {statItems.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`p-8 border transition-all ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}
        >
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2">
            {item.label}
          </p>
          <p className={`text-4xl font-black ${i === 0 || i === 1 ? themeClasses.accentText : ''}`}>
            {item.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
