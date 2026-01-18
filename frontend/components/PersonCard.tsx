import React from 'react';
import { Person, PoliticalPosition, ThemeClasses } from '../types';

interface PersonCardProps {
  person: Person;
  onClick: (person: Person) => void;
  isDarkMode: boolean;
  themeClasses: ThemeClasses;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onClick, isDarkMode, themeClasses }) => {
  const getStatusType = () => {
    if (person.position === PoliticalPosition.BETRAYAL) return 'danger';
    return 'warning';
  };

  const statusType = getStatusType();

  let statusClasses = '';
  if (statusType === 'danger') {
    statusClasses = isDarkMode
      ? 'bg-red-900/20 text-red-500 border-red-900/50'
      : 'bg-red-50 text-red-700 border-red-200';
  } else {
    statusClasses = isDarkMode
      ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
      : 'bg-slate-100 text-slate-600 border-slate-200';
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick(person);
    }
  };

  return (
    <div
      onClick={() => onClick(person)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      className={`border transition-all cursor-pointer group p-6 flex flex-col md:flex-row gap-8 ${themeClasses.card}`}
    >
      {/* Фото/Іконка */}
      <div
        className={`w-24 h-24 flex-shrink-0 flex items-center justify-center transition-colors border overflow-hidden ${isDarkMode ? 'bg-zinc-800/50 border-zinc-800 text-zinc-700 group-hover:text-red-900/50' : 'bg-slate-50 border-slate-100 text-slate-300 group-hover:text-red-200'}`}
      >
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

      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div>
            <h3
              className="text-2xl font-black uppercase tracking-tight group-hover:text-red-600 transition-colors leading-none mb-2"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {person.name}
            </h3>
            <p className={`font-bold text-xs uppercase tracking-widest ${themeClasses.textMuted}`}>
              {person.category}
            </p>
          </div>
          <span
            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] border ${statusClasses}`}
          >
            {person.position === PoliticalPosition.BETRAYAL ? 'Колаборант' : 'Під перевіркою'}
          </span>
        </div>

        <p className={`text-sm mb-4 line-clamp-2 ${themeClasses.textMuted}`}>
          {person.description}
        </p>

        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <div className="flex items-center gap-2">
            <span className={themeClasses.accentText}>●</span> РЕЙТИНГ: {person.score}
          </div>
          <div className="flex items-center gap-2">
            <svg
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {person.lastUpdated}
          </div>
          <div className="flex gap-2">
            <span
              className={`px-2 py-0.5 border text-[9px] ${isDarkMode ? 'border-zinc-800' : 'border-slate-200'}`}
            >
              Доказів: {person.proofsCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PersonCard);
