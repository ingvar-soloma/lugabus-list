import React, { useState, useEffect } from 'react';
import { Person, PoliticalPosition, ThemeClasses } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ShieldAlert,
  ShieldQuestion,
  Brain,
  Link2,
  FileText,
  Image,
  Video,
  Vote,
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { useAppContext } from '../store/AppContext';
import AddEvidenceModal from './AddEvidenceModal';

interface PersonModalProps {
  person: Person | null;
  onClose: () => void;
  isDarkMode: boolean;
  themeClasses: ThemeClasses;
}

const PersonModal: React.FC<PersonModalProps> = ({ person, onClose, isDarkMode, themeClasses }) => {
  const [isAddEvidenceOpen, setIsAddEvidenceOpen] = useState(false);
  const { showToast, refreshData } = useAppContext();

  useEffect(() => {
    if (person) {
      const startTime = Date.now();
      return () => {
        const timeSpent = Date.now() - startTime;
        apiService.trackVisit(person.id, timeSpent);
      };
    }
  }, [person]);

  if (!person) return null;

  const handleVote = async (proofId: string, type: 'like' | 'dislike') => {
    try {
      await apiService.voteProof(proofId, type);
      showToast(type === 'like' ? 'Дякуємо за голос!' : 'Висловили сумнів', 'info');
      refreshData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Помилка при голосуванні';
      showToast(message, 'error');
    }
  };

  const handlePriorityVote = async () => {
    try {
      await apiService.voteForDeepCheck(person.id);
      showToast('Голос за глибоку перевірку зараховано', 'success');
      refreshData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Помилка при голосуванні';
      showToast(message, 'error');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`relative w-full max-w-4xl max-h-[85vh] border rounded-sm overflow-hidden flex flex-col shadow-2xl ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-200'} ${themeClasses.textMain}`}
        >
          {/* Header */}
          <div
            className={`p-8 border-b flex justify-between items-start ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-50 border-slate-100'}`}
          >
            <div className="flex space-x-8">
              {person.avatarSvg ? (
                <div
                  className="w-28 h-28 rounded-none overflow-hidden border border-zinc-800 shadow-xl"
                  dangerouslySetInnerHTML={{ __html: person.avatarSvg }}
                />
              ) : (
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-28 h-28 rounded-none object-cover border border-zinc-800 shadow-xl"
                />
              )}
              <div className="flex flex-col justify-center">
                <h2 className="text-4xl font-black tracking-tighter mb-1 font-montserrat uppercase">
                  {person.name}
                </h2>
                <p
                  className={`text-xs font-black uppercase tracking-[0.2em] mb-4 ${themeClasses.accentText}`}
                >
                  {person.category}
                </p>
                <div className="flex space-x-2">
                  {person.position === PoliticalPosition.BETRAYAL ? (
                    <span className="bg-red-900/20 text-red-500 px-3 py-1 border border-red-900/50 text-[10px] font-black tracking-widest uppercase flex items-center">
                      <ShieldAlert className="mr-1" size={12} /> Колаборант
                    </span>
                  ) : (
                    <span className="bg-zinc-800 text-zinc-400 px-3 py-1 border border-zinc-700 text-[10px] font-black tracking-widest uppercase flex items-center">
                      <ShieldQuestion className="mr-1" size={12} /> Під перевіркою
                    </span>
                  )}
                </div>
                <button
                  onClick={() => (globalThis.location.href = '#')}
                  className="text-[9px] text-zinc-600 mt-2 hover:text-zinc-400 transition-colors text-left flex items-center group/ai"
                  title="Дані згенеровані або перевірені AI на основі відкритих джерел"
                >
                  <Brain size={10} className="mr-1 opacity-50 group-hover/ai:text-red-500" />
                  Згенеровано AI. Оціночне судження.{' '}
                  <span className="underline ml-1">Детальніше</span>
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePriorityVote}
                className="bg-red-900/10 text-red-500 px-4 py-2.5 border border-red-900/20 text-[10px] font-black tracking-widest uppercase flex items-center hover:bg-red-700 hover:text-white transition-all shadow-lg"
                title="Підняти в рейтингу для глибокої перевірки"
              >
                <Brain className="mr-2" size={14} /> Глибока перевірка
              </button>
              <button
                onClick={onClose}
                className={`p-2.5 rounded-none border transition-colors ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700' : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'}`}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            {/* Bio Section */}
            <section>
              <h4
                className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center ${themeClasses.textMuted}`}
              >
                <Clock className={`mr-2 ${themeClasses.accentText}`} size={14} /> Аналіз позиції
              </h4>
              <p
                className={`leading-relaxed text-lg font-medium italic opacity-80 border-l-4 pl-6 ${isDarkMode ? 'text-zinc-300 border-red-900/50' : 'text-slate-700 border-red-200'}`}
              >
                "{person.description}"
              </p>
              <p className="text-[10px] text-zinc-600 mt-3 ml-6 font-bold uppercase tracking-widest italic flex items-center">
                <Brain size={10} className={`mr-2 ${themeClasses.accentText} opacity-50`} />
                AI Verdict: Оціночне судження на основі аналізу доказів
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Timeline */}
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">
                  Хронологія
                </h4>
                <div className="space-y-8 relative ml-3 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-zinc-800">
                  {person.history.map((event) => {
                    const getPositionColor = (pos: PoliticalPosition) => {
                      switch (pos) {
                        case PoliticalPosition.SUPPORT:
                          return 'bg-zinc-500';
                        case PoliticalPosition.BETRAYAL:
                          return 'bg-red-600';
                        default:
                          return 'bg-zinc-400';
                      }
                    };

                    return (
                      <div key={event.id} className="relative pl-8">
                        <div
                          className={`absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ${isDarkMode ? 'ring-zinc-950' : 'ring-white'} ${getPositionColor(event.position)}`}
                        />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                          {event.date}
                        </span>
                        <h5
                          className={`font-black mt-0.5 tracking-tight ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}
                        >
                          {event.title}
                        </h5>
                        <p className={`text-sm mt-1 leading-snug ${themeClasses.textMuted}`}>
                          {event.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Proofs List */}
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">
                  Матеріали та докази
                </h4>
                <div className="space-y-4">
                  {person.proofs.map((proof) => {
                    const getIcon = () => {
                      switch (proof.type) {
                        case 'IMAGE':
                          return <Image size={14} />;
                        case 'DOCUMENT':
                          return <FileText size={14} />;
                        case 'VIDEO':
                          return <Video size={14} />;
                        case 'VOTE_RECORD':
                          return <Vote size={14} />;
                        default:
                          return <Link2 size={14} />;
                      }
                    };

                    return (
                      <div
                        key={proof.id}
                        className={`p-5 rounded-none border group transition-all ${isDarkMode ? 'bg-zinc-900/40 border-zinc-800 hover:border-red-900/50' : 'bg-slate-50 border-slate-100 hover:border-red-200'}`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`flex items-center space-x-2 px-2 py-1 border ${isDarkMode ? 'text-red-500 bg-red-900/10 border-red-900/20' : 'text-red-700 bg-red-50 border-red-100'}`}
                            >
                              {getIcon()}
                              <span className="text-[10px] font-black uppercase tracking-widest">
                                {proof.type || 'LINK'}
                              </span>
                            </div>

                            {proof.submittedBy && (
                              <div
                                className={`flex items-center space-x-2 pr-3 border overflow-hidden transition-all ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-slate-200'}`}
                              >
                                <div
                                  className="w-6 h-6 border-r border-zinc-700"
                                  dangerouslySetInnerHTML={{ __html: proof.submittedBy.avatarSvg }}
                                />
                                <span
                                  className={`text-[9px] font-bold uppercase tracking-tight ${themeClasses.textMuted}`}
                                >
                                  {proof.submittedBy.nickname}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-600 font-bold">{proof.date}</span>
                        </div>
                        <p
                          className={`text-sm mb-4 leading-relaxed font-medium ${isDarkMode ? 'text-zinc-200' : 'text-slate-800'}`}
                        >
                          {proof.text}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <a
                              href={proof.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-[10px] flex items-center hover:underline font-black uppercase tracking-widest ${themeClasses.accentText}`}
                              title={`Перейти до першоджерела: ${proof.sourceUrl}`}
                            >
                              <ExternalLink size={12} className="mr-1.5" /> Джерело
                            </a>
                            <a
                              href={`https://web.archive.org/web/*/${proof.sourceUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-zinc-500 flex items-center hover:underline font-black uppercase tracking-widest"
                              title="Переглянути архівну копію у Wayback Machine"
                            >
                              <Clock size={12} className="mr-1.5" /> Архів
                            </a>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleVote(proof.id, 'like')}
                              className={`flex items-center space-x-1.5 text-xs transition-colors hover:text-red-500 ${isDarkMode ? 'text-zinc-600' : 'text-slate-400'}`}
                            >
                              <ThumbsUp size={14} />{' '}
                              <span className="font-bold">{proof.likes}</span>
                            </button>
                            <button
                              onClick={() => handleVote(proof.id, 'dislike')}
                              className={`flex items-center space-x-1.5 text-xs transition-colors hover:text-red-500 ${isDarkMode ? 'text-zinc-600' : 'text-slate-400'}`}
                            >
                              <ThumbsDown size={14} />{' '}
                              <span className="font-bold">{proof.dislikes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => setIsAddEvidenceOpen(true)}
                    className={`w-full py-5 border border-dashed rounded-none transition-all font-black text-xs tracking-widest uppercase ${isDarkMode ? 'border-zinc-800 text-zinc-600 hover:text-red-500 hover:border-red-900/50' : 'border-slate-200 text-slate-400 hover:text-red-700 hover:border-red-200'}`}
                  >
                    Запропонувати доказ
                  </button>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>

      <AddEvidenceModal
        personId={person.id}
        personName={person.name}
        isOpen={isAddEvidenceOpen}
        onClose={() => setIsAddEvidenceOpen(false)}
        onSuccess={() => refreshData()}
      />
    </AnimatePresence>
  );
};

export default PersonModal;
