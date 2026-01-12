
import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Users, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const StatsBar: React.FC = () => {
  const { stats } = useAppContext();

  if (!stats) return null;

  const statItems = [
    { label: 'Моніторинг', value: stats.totalMonitored, icon: Users, color: 'text-blue-400' },
    { label: 'Зашквар', value: stats.betrayalCount, icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Патріоти', value: stats.supportCount, icon: ShieldCheck, color: 'text-emerald-500' },
    { label: 'Активність за тиждень', value: stats.weeklyActivity, icon: Activity, color: 'text-amber-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, idx) => (
        <motion.div 
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="glass p-4 rounded-2xl flex items-center space-x-4"
        >
          <div className={`p-3 rounded-xl bg-slate-900/50 ${item.color}`}>
            <item.icon size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{item.label}</p>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
