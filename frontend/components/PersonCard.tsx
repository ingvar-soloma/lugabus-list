import React from 'react';
import { Person, PoliticalPosition } from '../types';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldQuestion, Calendar } from 'lucide-react';

interface PersonCardProps {
  person: Person;
  onClick: (person: Person) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onClick }) => {
  const getPositionBadge = (pos: PoliticalPosition) => {
    const label = (text: string, icon: React.ReactNode, bgColor: string, textColor: string, borderColor: string) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${bgColor} ${textColor} border ${borderColor}`}>
        {icon} {text} <span className="opacity-50 ml-1">(AI)</span>
      </span>
    );

    switch (pos) {
      case PoliticalPosition.SUPPORT:
        return label('Патріот', <ShieldCheck size={12} className="mr-1" />, 'bg-primary/10', 'text-primary', 'border-primary/20');
      case PoliticalPosition.BETRAYAL:
        return label('Зашквар', <ShieldAlert size={12} className="mr-1" />, 'bg-danger/10', 'text-danger', 'border-danger/20');
      default:
        return label('Морозиться', <ShieldQuestion size={12} className="mr-1" />, 'bg-amber-500/10', 'text-amber-400', 'border-amber-500/20');
    }
  };

  let scoreColor = 'text-amber-500';
  if (person.score > 50) scoreColor = 'text-primary';
  else if (person.score < 0) scoreColor = 'text-danger';

  return (
    <motion.div
      layout
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(person)}
      className="group glass rounded-2xl p-6 cursor-pointer relative overflow-hidden transition-all duration-300 glass-hover border border-white/5 hover:border-primary/30"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center space-x-4">
          <div className="relative overflow-hidden rounded-xl bg-zinc-900 border border-white/5 w-14 h-14">
            {person.avatarSvg ? (
              <div
                className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                dangerouslySetInnerHTML={{ __html: person.avatarSvg }}
              />
            ) : (
              <img
                src={person.avatar}
                alt={person.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
              />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-none tracking-tight group-hover:text-primary-light transition-colors font-montserrat">
              {person.name}
            </h3>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
              {person.category}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">{getPositionBadge(person.position)}</div>

      <p className="text-zinc-400 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
        {person.description}
      </p>

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-zinc-600 font-black tracking-widest">
            Рейтинг
          </span>
          <span className={`text-2xl font-black tracking-tighter ${scoreColor}`}>
            {person.score > 0 ? `+${person.score}` : person.score}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] uppercase text-zinc-600 font-black tracking-widest">
            Пруфи
          </span>
          <span className="text-2xl font-black tracking-tighter text-zinc-100">
            {person.proofsCount}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
        <Calendar size={10} className="mr-1.5" /> Оновлено: {person.lastUpdated}
      </div>
    </motion.div>
  );
};

export default React.memo(PersonCard);
