
import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle, XCircle, Users, FileText } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

const AdminDashboard: React.FC = () => {
  const { people } = useAppContext();
  const [activeTab, setActiveTab] = useState<'users' | 'proofs'>('proofs');

  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-white/10 bg-slate-900/30 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <ShieldCheck className="mr-2 text-blue-400" /> Адмін-панель
        </h2>
        <div className="flex bg-slate-950 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('proofs')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'proofs' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <FileText size={16} className="inline mr-1" /> Пруфи на модерації
          </button>
          <button 
             onClick={() => setActiveTab('users')}
             className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Users size={16} className="inline mr-1" /> Особи
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'proofs' ? (
          <div className="space-y-4">
            <div className="text-slate-500 text-sm font-medium uppercase tracking-widest mb-4">5 нових заявок</div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <p className="text-xs text-blue-400 font-bold mb-1">Олександр Петров</p>
                  <p className="text-sm text-slate-200">"Був помічений на зустрічі з..."</p>
                  <p className="text-[10px] text-slate-500 mt-2">Від: user_42 • 2 год тому</p>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all font-bold text-xs">
                    <CheckCircle size={14} /> <span>СХВАЛИТИ</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all font-bold text-xs">
                    <XCircle size={14} /> <span>ВІДХИЛИТИ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="text-slate-500 text-xs font-bold uppercase border-b border-white/5">
                   <th className="pb-4">Ім'я</th>
                   <th className="pb-4">Позиція</th>
                   <th className="pb-4">Рейтинг</th>
                   <th className="pb-4">Дії</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {people.map(p => (
                   <tr key={p.id} className="text-sm">
                     <td className="py-4 font-bold">{p.name}</td>
                     <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${p.position === 'BETRAYAL' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                          {p.position}
                        </span>
                     </td>
                     <td className="py-4">{p.score}</td>
                     <td className="py-4">
                       <button className="text-blue-400 font-bold hover:underline">Редагувати</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
