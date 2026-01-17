import React, { useEffect, useState } from 'react';
import {
  Activity,
  Brain,
  Calendar as CalendarIcon,
  CheckCircle,
  Edit3,
  FileText,
  History,
  Mail,
  ShieldCheck,
  Trash2,
  UserCircle,
  Users,
  XCircle,
} from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { apiService } from '../services/apiService';
import { AIInsight, AuditLog, User as UserType, Revision } from '../types';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const { people, showToast, refreshData } = useAppContext();
  const [activeTab, setActiveTab] = useState<'proofs' | 'entities' | 'audit' | 'ai' | 'users'>(
    'proofs',
  );
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'proofs') {
        const data = await apiService.fetchPendingRevisions();
        setRevisions(data);
      } else if (activeTab === 'audit') {
        const data = await apiService.fetchAuditLogs();
        setLogs(data);
      } else if (activeTab === 'ai') {
        const data = await apiService.fetchAIInsights();
        setInsights(data);
      } else if (activeTab === 'users') {
        const data = await apiService.fetchUsers();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to load admin data', error);
      showToast('Помилка при завантаженні даних', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const handleApprove = async (id: string) => {
    try {
      await apiService.approveRevision(id);
      showToast('Ревізію затверджено');
      loadAdminData();
      refreshData();
    } catch (error) {
      console.error('Approval failed', error);
      showToast('Помилка при затвердженні', 'error');
    }
  };

  const handleReject = async (id: string) => {
    const reason = globalThis.prompt('Причина відхилення:');
    if (reason === null) return;
    try {
      await apiService.rejectRevision(id, reason);
      showToast('Ревізію відхилено');
      loadAdminData();
    } catch (error) {
      console.error('Rejection failed', error);
      showToast('Помилка при відхиленні', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-[2rem] overflow-hidden border-white/5"
    >
      <div className="p-8 border-b border-white/5 bg-white/5 flex flex-col xl:flex-row justify-between items-center gap-6">
        <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center">
          <ShieldCheck className="mr-3 text-emerald-500" size={24} />
          Система Керування
        </h2>
        <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-white/5 flex-wrap justify-center">
          {[
            { id: 'proofs', label: 'Черга', icon: FileText },
            { id: 'entities', label: 'Особи', icon: Users },
            { id: 'users', label: 'Користувачі', icon: UserCircle },
            { id: 'audit', label: 'Аудит', icon: History },
            { id: 'ai', label: 'Consilium', icon: Brain },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as 'proofs' | 'entities' | 'audit' | 'ai' | 'users')
              }
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <tab.icon size={14} className="inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 min-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'proofs' && (
              <div className="space-y-4">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                  Черга модерації: {revisions.length} активних заявок
                </p>
                {revisions.length === 0 && (
                  <div className="text-center py-20 text-zinc-600 font-bold uppercase tracking-widest">
                    Черга порожня
                  </div>
                )}
                {revisions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center group hover:border-emerald-500/20 transition-all"
                  >
                    <div className="mb-6 lg:mb-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">
                          Об'єкт: {item.person?.name || 'Н/Д'}
                        </p>
                        <span className="text-[9px] text-zinc-600 px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                          REVISION ID: {item.id.substring(0, 8)}
                        </span>
                      </div>
                      <p className="text-base text-zinc-200 font-medium leading-relaxed max-w-md">
                        {item.reason || 'Запропоновано зміни до даних або докази'}
                      </p>
                      <div className="mt-3 space-y-2">
                        {item.evidences?.map((ev) => (
                          <p
                            key={ev.url}
                            className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic truncate max-w-xs"
                          >
                            Доказ: {ev.url}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-3 w-full lg:w-auto">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex-1 lg:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-zinc-950 transition-all font-black text-[10px] uppercase tracking-widest border border-emerald-500/20"
                      >
                        <CheckCircle size={14} /> <span>ЗАТВЕРДИТИ</span>
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex-1 lg:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest border border-red-500/20"
                      >
                        <XCircle size={14} /> <span>ВІДХИЛИТИ</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'entities' && (
              <div className="overflow-x-auto">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                    Реєстр публічних осіб
                  </p>
                  <button className="px-4 py-2 bg-emerald-500 text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    + Додати особу
                  </button>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                      <th className="pb-6 px-4">Ім'я</th>
                      <th className="pb-6 px-4">Категорія</th>
                      <th className="pb-6 px-4">Позиція</th>
                      <th className="pb-6 px-4 text-right">Дії</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {people.map((p) => (
                      <tr key={p.id} className="text-sm group hover:bg-white/5 transition-colors">
                        <td className="py-5 px-4 font-black tracking-tight text-zinc-200">
                          {p.name}
                        </td>
                        <td className="py-5 px-4 text-zinc-500 font-bold uppercase text-[10px]">
                          {p.category}
                        </td>
                        <td className="py-5 px-4">
                          {(() => {
                            let positionClass = 'bg-amber-500/10 text-amber-500';
                            if (p.position === 'BETRAYAL') {
                              positionClass = 'bg-red-500/10 text-red-500';
                            } else if (p.position === 'SUPPORT') {
                              positionClass = 'bg-emerald-500/10 text-emerald-500';
                            }
                            return (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${positionClass}`}
                              >
                                {p.position}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="py-5 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button className="p-2 text-zinc-500 hover:text-emerald-500">
                              <Edit3 size={16} />
                            </button>
                            <button className="p-2 text-zinc-500 hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                  База зареєстрованих користувачів
                </p>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                      <th className="pb-6 px-4">Користувач</th>
                      <th className="pb-6 px-4">Роль</th>
                      <th className="pb-6 px-4">Username</th>
                      <th className="pb-6 px-4">Активність</th>
                      <th className="pb-6 px-4 text-right">Реєстрація</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u.id} className="text-sm group hover:bg-white/5 transition-colors">
                        <td className="py-5 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={u.avatar}
                              alt={`${u.username}'s avatar`}
                              className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10"
                            />
                            <div>
                              <p className="font-black tracking-tight text-zinc-200">
                                {u.firstName} {u.lastName}
                              </p>
                              <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">
                                ID: {u.id.substring(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-4">
                          {(() => {
                            let roleClass = 'bg-zinc-800 text-zinc-400';
                            if (u.role === 'ADMIN') {
                              roleClass = 'bg-emerald-500/10 text-emerald-500';
                            } else if (u.role === 'MODERATOR') {
                              roleClass = 'bg-blue-500/10 text-blue-400';
                            }
                            return (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${roleClass}`}
                              >
                                {u.role}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="py-5 px-4 text-zinc-400 font-medium flex items-center space-x-2">
                          <Mail size={12} className="text-zinc-600" />
                          <span>{u.username}</span>
                        </td>
                        <td className="py-5 px-4">
                          <div className="flex flex-col leading-none">
                            <span className="text-emerald-500 font-black text-xs">
                              {u.reputation}
                            </span>
                            <span className="text-[9px] text-zinc-600 uppercase font-bold mt-1">
                              репутація
                            </span>
                          </div>
                        </td>
                        <td className="py-5 px-4 text-right text-zinc-500 font-bold uppercase text-[10px]">
                          <div className="flex items-center justify-end space-x-1.5">
                            <CalendarIcon size={12} />
                            <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-4">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                  Журнал дій адміністрації
                </p>
                {logs.length === 0 && (
                  <div className="text-center py-20 text-zinc-600 font-bold uppercase tracking-widest">
                    Журнал порожній
                  </div>
                )}
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-zinc-900/20 p-4 rounded-xl border border-white/5 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500">
                        <Activity size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold">
                          <span className="text-emerald-500">{log.userId}</span> — {log.action}
                        </p>
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-1">
                          Деталі: {JSON.stringify(log.details)}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full mb-4">
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                    Висновки AI-Консиліуму
                  </p>
                </div>
                {insights.length === 0 && (
                  <div className="col-span-full text-center py-20 text-zinc-600 font-bold uppercase tracking-widest">
                    AI ще не сформував висновків
                  </div>
                )}
                {insights.map((insight) => (
                  <div key={insight.id} className="glass p-6 rounded-3xl border-white/10 relative">
                    <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-1 rounded-lg">
                      Confidence: {(insight.confidence * 100).toFixed(0)}%
                    </div>
                    <div className="flex items-start space-x-4">
                      <Brain size={24} className="text-purple-400 mt-1" />
                      <div>
                        <h4 className="font-black tracking-tight mb-2">
                          Об'єкт: #{insight.targetId.substring(0, 8)}
                        </h4>
                        <p className="text-sm text-zinc-400 leading-relaxed italic">
                          "{insight.summary}"
                        </p>
                        <div
                          className={`mt-4 inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${insight.sentiment === 'NEGATIVE' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}
                        >
                          Тональність: {insight.sentiment}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
