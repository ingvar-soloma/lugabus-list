
import React from 'react';
import { Person, PoliticalPosition } from '../types';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldQuestion, Calendar, Star } from 'lucide-react';

interface PersonCardProps {
  person: Person;
  onClick: (person: Person) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onClick }) => {
  const getPositionBadge = (pos: PoliticalPosition) => {
    switch (pos) {
      case PoliticalPosition.SUPPORT:
        return <span className="flex items-center space-x-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full text-xs font-bold border border-emerald-400/20"><ShieldCheck size={14}/> <span>Патріот</span></span>;
      case PoliticalPosition.BETRAYAL:
        return <span className="flex items-center space-x-1 text-red-400 bg-red-400/10 px-2 py-1 rounded-full text-xs font-bold border border-red-400/20"><ShieldAlert size={14}/> <span>Зашквар</span></span>;
      default:
        return <span className="flex items-center space-x-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full text-xs font-bold border border-amber-400/20"><ShieldQuestion size={14}/> <span>Морозиться</span></span>;
    }
  };

  const scoreColor = person.score > 50 ? 'text-emerald-500' : person.score < 0 ? 'text-red-500' : 'text-amber-500';

  return (
    <motion.div 
      layout
      whileHover={{ y: -5 }}
      onClick={() => onClick(person)}
      className="glass rounded-3xl p-5 cursor-pointer relative overflow-hidden group transition-all duration-300 glass-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img 
            src={person.avatar} 
            alt={person.name} 
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-800"
          />
          <div>
            <h3 className="font-bold text-lg leading-tight group-hover:text-blue-400 transition-colors">{person.name}</h3>
            <p className="text-slate-400 text-sm">{person.category}</p>
          </div>
        </div>
        {getPositionBadge(person.position)}
      </div>

      <p className="text-slate-300 text-sm line-clamp-2 mb-6 min-h-[40px]">
        {person.description}
      </p>

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Рейтинг</span>
          <span className={`text-xl font-black ${scoreColor}`}>
            {person.score > 0 ? `+${person.score}` : person.score}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Пруфів</span>
          <span className="text-lg font-bold text-slate-200">{person.proofsCount}</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center text-[10px] text-slate-500 font-medium">
        <Calendar size={12} className="mr-1" /> Оновлено: {person.lastUpdated}
      </div>
    </motion.div>
  );
};

export default React.memo(PersonCard);
