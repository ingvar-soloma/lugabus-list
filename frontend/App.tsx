import React, { useState, useMemo, useEffect } from 'react';
import { AppProvider, useAppContext } from '@/store/AppContext';
import { Search, LogOut, AlertCircle, Mail, Plus, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatsBar from '@/components/StatsBar';
import PersonCard from '@/components/PersonCard';
import PersonModal from '@/components/PersonModal';
import AdminDashboard from '@/components/AdminDashboard';
import AuthModal from '@/components/AuthModal';
import AddFigureModal from '@/components/AddFigureModal';
import { CATEGORIES } from '@/constants';
import { Person, UserRole, ThemeClasses } from '@/types';
import { TermsOfServicePage, PrivacyPolicyPage, AboutAIPage } from '@/components/LegalPages';

// Page Components
const MethodologyPage = ({ themeClasses }: { themeClasses: ThemeClasses }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 py-10">
    <h1
      className={`text-6xl font-black tracking-tighter uppercase mb-10 italic ${themeClasses.textMain}`}
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      Методологія<span className="text-red-600">.org</span>
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className={`p-8 border rounded-none ${themeClasses.card}`}>
        <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-red-600 italic">
          01. Джерела даних
        </h3>
        <p className={`${themeClasses.textMuted} leading-relaxed font-medium`}>
          Ми приймаємо лише прямі посилання на відео, офіційні документи або верифіковані дописи у
          соціальних мережах. Посилання на анонімні Telegram-канали без додаткових доказів не
          розглядаються.
        </p>
      </div>
      <div className={`p-8 border rounded-none ${themeClasses.card}`}>
        <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-red-600 italic">
          02. Процес верифікації
        </h3>
        <p className={`${themeClasses.textMuted} leading-relaxed font-medium`}>
          Кожен запропонований пруф проходить три стадії: автоматичний ШІ-аналіз тональності,
          перевірка модератором та публічне голосування спільноти (Feedback Loop).
        </p>
      </div>
    </div>
  </motion.div>
);

const ContactPage = ({
  subject,
  themeClasses,
}: {
  subject?: string;
  themeClasses: ThemeClasses;
}) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto py-10">
    <h1
      className={`text-6xl font-black tracking-tighter uppercase mb-10 text-center italic ${themeClasses.textMain}`}
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      Контакти<span className="text-red-600">.org</span>
    </h1>
    <div className={`p-10 border relative overflow-hidden ${themeClasses.card}`}>
      <div className="absolute top-0 right-0 p-10 text-red-500/5">
        <Mail size={120} />
      </div>
      <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="contact-name"
            className={`text-[10px] font-black uppercase tracking-widest mb-2 block ${themeClasses.textMuted}`}
          >
            Ваше Ім'я або Організація
          </label>
          <input
            id="contact-name"
            type="text"
            className={`w-full border rounded-none p-4 outline-none transition-all ${themeClasses.input} focus:ring-2`}
            placeholder="Введіть дані..."
          />
        </div>
        <div>
          <label
            htmlFor="contact-subject"
            className={`text-[10px] font-black uppercase tracking-widest mb-2 block ${themeClasses.textMuted}`}
          >
            Тема звернення
          </label>
          <input
            id="contact-subject"
            type="text"
            className={`w-full border rounded-none p-4 outline-none transition-all ${themeClasses.input} focus:ring-2`}
            placeholder="Тема..."
            defaultValue={subject}
          />
        </div>
        <div>
          <label
            htmlFor="contact-message"
            className={`text-[10px] font-black uppercase tracking-widest mb-2 block ${themeClasses.textMuted}`}
          >
            Суть звернення
          </label>
          <textarea
            id="contact-message"
            className={`w-full border rounded-none p-4 h-32 outline-none transition-all ${themeClasses.input} focus:ring-2`}
            placeholder="Опишіть вашу пропозицію або скаргу..."
          ></textarea>
        </div>
        <button
          className={`w-full text-white py-5 rounded-none font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${themeClasses.accentBg}`}
        >
          Надіслати Повідомлення
        </button>
      </form>
    </div>
  </motion.div>
);

const PrivacyBanner = () => {
  const [isOpen, setIsOpen] = useState(!localStorage.getItem('privacyAccepted'));

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 left-8 right-8 z-[100] max-w-lg"
    >
      <div className="glass p-6 rounded-none border-red-900/20 shadow-2xl flex flex-col space-y-4">
        <div className="flex items-start space-x-4">
          <div className="bg-red-900/10 p-3 rounded-none text-red-500 shrink-0">
            <Lock size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black uppercase tracking-widest">
              Приватність та анонімність
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">
              Ми використовуємо технічні методи ідентифікації (Browser Fingerprinting) виключно для
              захисту від спаму та атак. Ми не збираємо ваші ПІБ, IP чи e-mail. Продовжуючи
              використання, ви погоджуєтесь на анонімну обробку даних.
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              localStorage.setItem('privacyAccepted', 'true');
              setIsOpen(false);
            }}
            className="flex-1 bg-red-700 text-white py-3 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all"
          >
            Прийняти
          </button>
          <button
            onClick={() => (window.location.href = 'https://google.com')}
            className="px-6 py-3 border border-white/10 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-zinc-500"
          >
            Вийти
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const LogoIcon = ({
  className = 'w-6 h-6',
  isDarkMode,
}: {
  className?: string;
  isDarkMode: boolean;
}) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect
      width="24"
      height="24"
      rx="2"
      fill={isDarkMode ? '#7f1d1d' : '#991b1b'}
      fillOpacity="0.1"
    />
    <path
      d="M4 7H20M4 12H15M4 17H11"
      stroke={isDarkMode ? '#ef4444' : '#b91c1c'}
      strokeWidth="2.5"
      strokeLinecap="square"
    />
    <circle cx="18" cy="16" r="3" fill={isDarkMode ? '#ef4444' : '#b91c1c'} />
  </svg>
);

const LugaBusContent: React.FC = () => {
  const { user, people, loading, logout } = useAppContext();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Всі');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isAddFigureModalOpen, setIsAddFigureModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<
    'home' | 'methodology' | 'contact' | 'admin' | 'tos' | 'privacy' | 'about-ai'
  >('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Нова колірна схема (Червоний + Сірий)
  const themeClasses: ThemeClasses = {
    bg: isDarkMode ? 'bg-zinc-950' : 'bg-slate-50',
    header: isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200',
    card: isDarkMode
      ? 'bg-zinc-900 border-zinc-800 hover:border-red-900/50'
      : 'bg-white border-slate-200 hover:border-red-200',
    textMain: isDarkMode ? 'text-zinc-100' : 'text-slate-900',
    textMuted: isDarkMode ? 'text-zinc-400' : 'text-slate-500',
    input: isDarkMode
      ? 'bg-zinc-900 border-zinc-800 text-white focus:ring-red-950'
      : 'bg-white border-slate-200 text-slate-900 focus:ring-red-50',
    footer: isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-slate-200',
    tag: isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500',
    navLink: isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-900',
    accentText: isDarkMode ? 'text-red-500' : 'text-red-600',
    accentBg: isDarkMode
      ? 'bg-red-700 hover:bg-red-600 shadow-red-950/20'
      : 'bg-red-600 hover:bg-red-700 shadow-red-500/20',
  };

  const [contactSubject, setContactSubject] = useState<string | undefined>(undefined);

  const filteredPeople = useMemo(() => {
    return people
      .filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'Всі' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => b.score - a.score);
  }, [people, search, selectedCategory]);

  let content;
  if (loading) {
    content = (
      <div className="h-96 flex flex-col items-center justify-center space-y-6">
        <div className="w-10 h-10 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  } else if (filteredPeople.length > 0) {
    content = (
      <div className="space-y-4">
        {filteredPeople.map((p) => (
          <PersonCard
            key={p.id}
            person={p}
            onClick={setSelectedPerson}
            isDarkMode={isDarkMode}
            themeClasses={themeClasses}
          />
        ))}
      </div>
    );
  } else {
    content = (
      <div className="h-96 glass rounded-3xl flex flex-col items-center justify-center text-center p-12">
        <AlertCircle size={40} className="text-zinc-800 mb-6" />
        <h3 className="text-2xl font-black tracking-tight mb-2">РЕЗУЛЬТАТІВ НЕМАЄ</h3>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pb-20 transition-colors duration-500 ${themeClasses.bg} ${themeClasses.textMain}`}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700&display=swap');`}
      </style>
      {/* Navigation */}
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all ${themeClasses.header}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              className="text-xl flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              onClick={() => setCurrentPage('home')}
            >
              <LogoIcon isDarkMode={isDarkMode} className="w-6 h-6" />
              <div className="flex items-center">
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                  Luga
                </span>
                <span className={`font-medium ${themeClasses.accentText}`}>bus</span>
                <span className="text-xs text-zinc-500 ml-1">.org</span>
              </div>
            </button>
            <nav className="hidden lg:flex gap-8 text-[10px] font-bold uppercase tracking-[0.15em]">
              <button
                onClick={() => setCurrentPage('home')}
                className={`${currentPage === 'home' ? themeClasses.accentText + ' border-b-2 border-current pb-2 mt-2' : 'pb-2 mt-2 transition-colors ' + themeClasses.navLink}`}
              >
                Реєстр
              </button>
              <button
                onClick={() => setCurrentPage('methodology')}
                className={`${currentPage === 'methodology' ? themeClasses.accentText + ' border-b-2 border-current pb-2 mt-2' : 'pb-2 mt-2 transition-colors ' + themeClasses.navLink}`}
              >
                Методологія
              </button>
              <button
                onClick={() => setCurrentPage('about-ai')}
                className={`${currentPage === 'about-ai' ? themeClasses.accentText + ' border-b-2 border-current pb-2 mt-2' : 'pb-2 mt-2 transition-colors ' + themeClasses.navLink}`}
              >
                ШІ Аналіз
              </button>
              <button
                onClick={() => {
                  setContactSubject(undefined);
                  setCurrentPage('contact');
                }}
                className={`${currentPage === 'contact' ? themeClasses.accentText + ' border-b-2 border-current pb-2 mt-2' : 'pb-2 mt-2 transition-colors ' + themeClasses.navLink}`}
              >
                Контакти
              </button>
              {(user?.role === UserRole.ADMIN || user?.role === UserRole.MODERATOR) && (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className={`${currentPage === 'admin' ? themeClasses.accentText + ' border-b-2 border-current pb-2 mt-2' : 'pb-2 mt-2 transition-colors ' + themeClasses.navLink}`}
                >
                  Адмін
                </button>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg border transition-all ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
            >
              {isDarkMode ? (
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block text-right leading-none">
                  <p className={`text-xs font-black tracking-tight ${themeClasses.accentText}`}>
                    {user.nickname || user.username}
                  </p>
                  <p
                    className={`text-[9px] uppercase tracking-widest mt-1 ${themeClasses.textMuted}`}
                  >
                    {user.role}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className={`p-2 transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-red-500' : 'text-slate-400 hover:text-red-600'}`}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`${themeClasses.accentBg} text-white px-5 py-2 rounded-none font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-900/20`}
              >
                Вхід
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="py-12"
            >
              {/* Секція пошуку */}
              <div className="max-w-4xl mb-16">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4 ${isDarkMode ? 'bg-red-900/20 text-red-500' : 'bg-red-100 text-red-800'}`}
                >
                  Моніторинг публічної активності
                </div>
                <h1
                  className="text-4xl sm:text-6xl font-black mb-6 tracking-tighter uppercase"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  База даних <br />
                  <span className={themeClasses.accentText}>колаборантів</span>
                </h1>
                <p className={`text-lg mb-10 max-w-2xl leading-relaxed ${themeClasses.textMuted}`}>
                  Документування фактів державної зради та добровільної співпраці з окупаційними
                  структурами на території Луганської області.
                </p>

                <div className="relative group max-w-3xl">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Search
                      className={`${isDarkMode ? 'text-zinc-600' : 'text-slate-400'} group-focus-within:text-red-600 transition-colors`}
                      size={20}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="ПОШУК ЗА ПІБ, ПОСАДОЮ АБО МІСТОМ..."
                    className={`w-full h-16 pl-14 pr-6 border rounded-sm focus:ring-0 focus:outline-none transition-all text-lg font-medium ${isDarkMode ? 'border-zinc-800 focus:border-red-800' : 'border-slate-200 focus:border-red-300'} ${themeClasses.input}`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Статистична панель */}
              <StatsBar isDarkMode={isDarkMode} themeClasses={themeClasses} />

              <div className="flex flex-col lg:flex-row gap-12 mt-12">
                {/* Фільтрація */}
                <aside className="w-full lg:w-64 space-y-10">
                  <div>
                    <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-6 tracking-[0.2em]">
                      Категорія
                    </h3>
                    <div className="space-y-4">
                      {['Всі', ...CATEGORIES.filter((c) => c !== 'Всі')].map((cat, idx) => (
                        <label
                          key={idx}
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => setSelectedCategory(cat)}
                        >
                          <div
                            className={`w-4 h-4 border transition-all ${selectedCategory === cat ? 'bg-red-600 border-red-600' : isDarkMode ? 'border-zinc-700' : 'border-slate-300'}`}
                          ></div>
                          <span
                            className={`text-xs font-bold uppercase tracking-wider transition-colors ${selectedCategory === cat ? (isDarkMode ? 'text-zinc-100' : 'text-slate-900') : isDarkMode ? 'text-zinc-500 group-hover:text-zinc-100' : 'text-slate-500 group-hover:text-slate-900'}`}
                          >
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {user && (
                    <div
                      className={`pt-8 border-t ${isDarkMode ? 'border-zinc-800' : 'border-slate-200'}`}
                    >
                      <button
                        onClick={() => setIsAddFigureModalOpen(true)}
                        className={`w-full py-4 text-[10px] font-black uppercase tracking-widest border transition-all ${themeClasses.accentBg} text-white`}
                      >
                        <Plus size={14} className="inline mr-2" /> Додати особу
                      </button>
                    </div>
                  )}

                  <div
                    className={`pt-8 border-t ${isDarkMode ? 'border-zinc-800' : 'border-slate-200'}`}
                  >
                    <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-6 tracking-[0.2em]">
                      Локація
                    </h3>
                    <select
                      className={`w-full p-3 rounded-none text-xs font-bold uppercase tracking-widest focus:outline-none appearance-none cursor-pointer border ${themeClasses.input}`}
                    >
                      <option>Весь Регіон</option>
                      <option>Луганськ</option>
                      <option>Старобільськ</option>
                      <option>Сєвєродонецьк</option>
                    </select>
                  </div>
                </aside>

                {/* Результати */}
                <div className="flex-1 space-y-px">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                      База даних (оновлено сьогодні)
                    </span>
                  </div>
                  {content}
                </div>
              </div>
            </motion.div>
          )}

          {currentPage === 'methodology' && (
            <MethodologyPage key="methodology" themeClasses={themeClasses} />
          )}
          {currentPage === 'contact' && (
            <ContactPage key="contact" subject={contactSubject} themeClasses={themeClasses} />
          )}
          {currentPage === 'admin' && (
            <AdminDashboard key="admin" isDarkMode={isDarkMode} themeClasses={themeClasses} />
          )}
          {currentPage === 'tos' && <TermsOfServicePage key="tos" themeClasses={themeClasses} />}
          {currentPage === 'privacy' && (
            <PrivacyPolicyPage key="privacy" themeClasses={themeClasses} />
          )}
          {currentPage === 'about-ai' && <AboutAIPage key="about-ai" themeClasses={themeClasses} />}
        </AnimatePresence>
      </main>

      {/* Detail Modal Container */}
      <PersonModal
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
        isDarkMode={isDarkMode}
        themeClasses={themeClasses}
      />
      <AddFigureModal
        isOpen={isAddFigureModalOpen}
        onClose={() => setIsAddFigureModalOpen(false)}
        onSuccess={() => {
          // Could refresh data here if needed, but since it goes to PENDING it won't show up anyway
          alert('Дані надіслано на перевірку!');
        }}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Футер */}
      <footer className={`mt-24 border-t py-20 transition-colors ${themeClasses.footer}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div
                className="flex items-center gap-2 mb-8"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <LogoIcon isDarkMode={isDarkMode} className="w-6 h-6" />
                <div className="text-2xl">
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                    Luga
                  </span>
                  <span className={`font-medium ${themeClasses.accentText}`}>bus</span>
                  <span className="text-xs text-zinc-500 ml-1">.org</span>
                </div>
              </div>
              <p
                className={`text-xs uppercase tracking-widest font-bold leading-loose max-w-sm ${themeClasses.textMuted}`}
              >
                Незалежний проект моніторингу державної зради. Кожен запит у базі підтверджений
                документально або через свідчення очевидців.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase mb-8 tracking-[0.3em]">Меню</h4>
              <ul
                className={`space-y-4 text-[10px] font-black uppercase tracking-widest ${themeClasses.textMuted}`}
              >
                <li>
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="hover:text-red-500 transition-colors uppercase"
                  >
                    Реєстр
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('methodology')}
                    className="hover:text-red-500 transition-colors uppercase"
                  >
                    Методологія
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('contact')}
                    className="hover:text-red-500 transition-colors uppercase"
                  >
                    Подати дані
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase mb-8 tracking-[0.3em]">Юридичне</h4>
              <ul
                className={`space-y-4 text-[10px] font-black uppercase tracking-widest ${themeClasses.textMuted}`}
              >
                <li>
                  <button
                    onClick={() => setCurrentPage('tos')}
                    className="hover:text-red-500 transition-colors uppercase"
                  >
                    Умови
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentPage('privacy')}
                    className="hover:text-red-500 transition-colors uppercase"
                  >
                    Приватність
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'border-zinc-900 text-zinc-700' : 'border-slate-100 text-slate-400'}`}
          >
            <span>© 2026 lugabus.org — Дані відкритого доступу</span>
            <div className="flex gap-8">
              <button
                onClick={() => setCurrentPage('methodology')}
                className="hover:text-red-600 transition-colors"
              >
                Методологія
              </button>
              <button
                onClick={() => setCurrentPage('contact')}
                className="hover:text-red-600 transition-colors"
              >
                Контакти
              </button>
            </div>
          </div>
        </div>
      </footer>
      <PrivacyBanner />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <LugaBusContent />
    </AppProvider>
  );
};

export default App;
