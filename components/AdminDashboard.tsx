
import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, XCircle, Users, FileText } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

const AdminDashboard: React.FC = () => {
  const { people } = useAppContext();
  const [activeTab, setActiveTab] = useState<'users' | 'proofs'>('proofs');

  return (
    <div className="glass rounded-[2rem] overflow-hidden border-white/5">
      <div className="p-8 border-b border-white/5 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center">
          <ShieldCheck className="mr-3 text-emerald-500" size={24} /> Admin Terminal
        </h2>
        <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('proofs')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'proofs' ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <FileText size={14} className="inline mr-2" /> Moderation
          </button>
          <button 
             onClick={() => setActiveTab('users')}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Users size={14} className="inline mr-2" /> Entities
          </button>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'proofs' ? (
          <div className="space-y-4">
            <div className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Queue: 5 pending submissions</div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-emerald-500/20 transition-all">
                <div className="mb-6 md:mb-0">
                  <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-1">Олександр Петров</p>
                  <p className="text-base text-zinc-200 font-medium leading-relaxed max-w-md">"Був помічений на несанкціонованому ефірі, де підтримав..."</p>
                  <p className="text-[9px] text-zinc-600 mt-3 font-bold uppercase tracking-widest italic">Source: External Link • 2h ago</p>
                </div>
                <div className="flex space-x-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-zinc-950 transition-all font-black text-[10px] uppercase tracking-widest border border-emerald-500/20">
                    <CheckCircle size={14} /> <span>Approve</span>
                  </button>
                  <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest border border-red-500/20">
                    <XCircle size={14} /> <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                   <th className="pb-6 px-4">Entity Name</th>
                   <th className="pb-6 px-4">Status</th>
                   <th className="pb-6 px-4">Score</th>
                   <th className="pb-6 px-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {people.map(p => (
                   <tr key={p.id} className="text-sm group hover:bg-white/5 transition-colors">
                     <td className="py-5 px-4 font-black tracking-tight text-zinc-200">{p.name}</td>
                     <td className="py-5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.position === 'BETRAYAL' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {p.position}
                        </span>
                     </td>
                     <td className="py-5 px-4 font-black text-zinc-400">{p.score}</td>
                     <td className="py-5 px-4 text-right">
                       <button className="text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:text-emerald-400 hover:underline transition-colors">Edit</button>
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
