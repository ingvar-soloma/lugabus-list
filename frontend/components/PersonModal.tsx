import { useState, useEffect } from 'react';
import { Person, PoliticalPosition } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Brain,
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { useAppContext } from '../store/AppContext';
import AddEvidenceModal from './AddEvidenceModal';

interface PersonModalProps {
  person: Person | null;
  onClose: () => void;
}

const PersonModal: React.FC<PersonModalProps> = ({ person, onClose }) => {
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
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl max-h-[85vh] glass rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl shadow-emerald-500/5 border border-white/10"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex justify-between items-start bg-white/5">
            <div className="flex space-x-8">
              <img
                src={person.avatar}
                alt={person.name}
                className="w-28 h-28 rounded-3xl object-cover ring-1 ring-white/10 shadow-xl"
              />
              <div className="flex flex-col justify-center">
                <h2 className="text-4xl font-black tracking-tighter mb-1">{person.name}</h2>
                <p className="text-emerald-500 text-xs font-black uppercase tracking-[0.2em] mb-4">
                  {person.category}
                </p>
                <div className="flex space-x-2">
                  {person.position === PoliticalPosition.SUPPORT && (
                    <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border border-emerald-500/20 uppercase flex items-center">
                      <ShieldCheck className="mr-1" size={12} /> Патріот
                    </span>
                  )}
                  {person.position === PoliticalPosition.BETRAYAL && (
                    <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border border-red-500/20 uppercase flex items-center">
                      <ShieldAlert className="mr-1" size={12} /> Зашквар
                    </span>
                  )}
                  {person.position === PoliticalPosition.NEUTRAL && (
                    <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest border border-amber-500/20 uppercase flex items-center">
                      <ShieldQuestion className="mr-1" size={12} /> Морозиться
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePriorityVote}
                className="bg-purple-500/10 text-purple-400 px-4 py-2.5 rounded-2xl text-[10px] font-black tracking-widest border border-purple-500/20 uppercase flex items-center hover:bg-purple-500 hover:text-white transition-all shadow-lg hover:shadow-purple-500/20"
                title="Підняти в рейтингу для глибокої перевірки"
              >
                <Brain className="mr-2" size={14} /> Глибока перевірка
              </button>
              <button
                onClick={onClose}
                className="p-2.5 bg-zinc-900/50 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            {/* Bio Section */}
            <section>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4 flex items-center">
                <Clock className="mr-2 text-emerald-500" size={14} /> Аналіз позиції
              </h4>
              <p className="text-zinc-300 leading-relaxed text-lg font-medium italic opacity-80 border-l-4 border-emerald-500/30 pl-6">
                "{person.description}"
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
                          return 'bg-emerald-500';
                        case PoliticalPosition.BETRAYAL:
                          return 'bg-red-500';
                        default:
                          return 'bg-amber-500';
                      }
                    };

                    return (
                      <div key={event.id} className="relative pl-8">
                        <div
                          className={`absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-zinc-950 ${getPositionColor(event.position)}`}
                        />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                          {event.date}
                        </span>
                        <h5 className="font-black text-zinc-100 mt-0.5 tracking-tight">
                          {event.title}
                        </h5>
                        <p className="text-sm text-zinc-400 mt-1 leading-snug">
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
                  {person.proofs.map((proof) => (
                    <div
                      key={proof.id}
                      className="bg-zinc-900/40 p-5 rounded-2xl border border-white/5 group hover:border-emerald-500/20 transition-all"
                    >
                      <p className="text-sm text-zinc-200 mb-4 leading-relaxed font-medium">
                        {proof.text}
                      </p>
                      <div className="flex items-center justify-between">
                        <a
                          href={proof.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-emerald-500 flex items-center hover:underline font-black uppercase tracking-widest"
                        >
                          <ExternalLink size={12} className="mr-1.5" /> Посилання
                        </a>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleVote(proof.id, 'like')}
                            className="flex items-center space-x-1.5 text-xs text-emerald-400/60 hover:text-emerald-400 transition-colors"
                          >
                            <ThumbsUp size={14} /> <span className="font-bold">{proof.likes}</span>
                          </button>
                          <button
                            onClick={() => handleVote(proof.id, 'dislike')}
                            className="flex items-center space-x-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors"
                          >
                            <ThumbsDown size={14} />{' '}
                            <span className="font-bold">{proof.dislikes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setIsAddEvidenceOpen(true)}
                    className="w-full py-5 border border-dashed border-zinc-800 rounded-2xl text-zinc-600 hover:text-emerald-500 hover:border-emerald-500/50 transition-all font-black text-xs tracking-widest uppercase"
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
