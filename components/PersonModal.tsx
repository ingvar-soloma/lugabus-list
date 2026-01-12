
import React from 'react';
import { Person, PoliticalPosition, Proof, TimelineEvent } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ThumbsUp, ThumbsDown, Clock, ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import { apiService } from '../services/apiService';

interface PersonModalProps {
  person: Person | null;
  onClose: () => void;
}

const PersonModal: React.FC<PersonModalProps> = ({ person, onClose }) => {
  if (!person) return null;

  const handleVote = async (proofId: string, type: 'like' | 'dislike') => {
    await apiService.voteProof(proofId, type);
    // In a real app, we'd update state here
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] glass rounded-3xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-start bg-slate-900/40">
            <div className="flex space-x-6">
              <img src={person.avatar} className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-800" />
              <div>
                <h2 className="text-3xl font-black mb-1">{person.name}</h2>
                <p className="text-blue-400 font-bold mb-3">{person.category}</p>
                <div className="flex space-x-2">
                    {person.position === PoliticalPosition.SUPPORT && <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 flex items-center"><ShieldCheck className="mr-1" size={14}/> ПАТРІОТ</span>}
                    {person.position === PoliticalPosition.BETRAYAL && <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30 flex items-center"><ShieldAlert className="mr-1" size={14}/> ЗАШКВАР</span>}
                    {person.position === PoliticalPosition.NEUTRAL && <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30 flex items-center"><ShieldQuestion className="mr-1" size={14}/> МОРОЗИТЬСЯ</span>}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Description */}
            <section>
              <h4 className="text-lg font-bold mb-3 flex items-center"><Clock className="mr-2 text-blue-400" size={18}/> Біографія позиції</h4>
              <p className="text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-2xl border border-white/5 italic">
                "{person.description}"
              </p>
            </section>

            {/* Timeline */}
            <section>
              <h4 className="text-lg font-bold mb-6">Хронологія дій</h4>
              <div className="space-y-6 relative ml-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-white/10">
                {person.history.map((event) => (
                  <div key={event.id} className="relative pl-8">
                    <div className={`absolute left-[-5px] top-1.5 w-[11px] h-[11px] rounded-full ring-4 ring-slate-950 ${event.position === PoliticalPosition.SUPPORT ? 'bg-emerald-500' : event.position === PoliticalPosition.BETRAYAL ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{event.date}</span>
                    <h5 className="font-bold text-slate-100">{event.title}</h5>
                    <p className="text-sm text-slate-400">{event.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Proofs */}
            <section>
              <h4 className="text-lg font-bold mb-4">Докази (Пруфи)</h4>
              <div className="space-y-4">
                {person.proofs.map((proof) => (
                  <div key={proof.id} className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="mb-4 md:mb-0 md:mr-6 flex-1">
                      <p className="text-sm text-slate-200 mb-2 leading-tight">{proof.text}</p>
                      <a href={proof.sourceUrl} className="text-xs text-blue-400 flex items-center hover:underline font-bold">
                        <ExternalLink size={12} className="mr-1" /> Джерело
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleVote(proof.id, 'like')} className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors border border-emerald-500/10">
                        <ThumbsUp size={14} /> <span>{proof.likes}</span>
                      </button>
                      <button onClick={() => handleVote(proof.id, 'dislike')} className="flex items-center space-x-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/10">
                        <ThumbsDown size={14} /> <span>{proof.dislikes}</span>
                      </button>
                    </div>
                  </div>
                ))}
                <button className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-500 hover:text-slate-300 hover:border-white/20 transition-all font-bold">
                  + ЗАПРОПОНУВАТИ НОВИЙ ПРУФ
                </button>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PersonModal;
