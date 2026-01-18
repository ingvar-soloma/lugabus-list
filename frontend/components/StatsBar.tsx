import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Users, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const StatsBar: React.FC = () => {
  const { stats } = useAppContext();

  if (!stats) return null;

  const statItems = [
    { label: 'Моніторинг', value: stats.totalMonitored, icon: Users, color: 'text-zinc-400' },
    { label: 'Зашквар', value: stats.betrayalCount, icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Патріоти', value: stats.supportCount, icon: ShieldCheck, color: 'text-primary' },
    { label: 'Активність', value: stats.weeklyActivity, icon: Activity, color: 'text-primary-light' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {statItems.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="glass p-5 rounded-2xl flex items-center space-x-4 border border-white/5 hover:border-white/10 transition-colors"
        >
          <div className={`p-2.5 rounded-lg bg-zinc-900/80 ${item.color}`}>
            <item.icon size={20} />
          </div>
          <div>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-0.5">
              {item.label}
            </p>
            <p className="text-2xl font-black tracking-tighter leading-none">{item.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
