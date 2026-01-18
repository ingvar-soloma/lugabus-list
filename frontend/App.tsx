import React, { useState, useMemo } from 'react';
import { AppProvider, useAppContext } from './store/AppContext';
import { Search, Shield, LogOut, LogIn, AlertCircle, Mail, Plus, Lock, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatsBar from './components/StatsBar';
import PersonCard from './components/PersonCard';
import PersonModal from './components/PersonModal';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import AddFigureModal from './components/AddFigureModal';
import { CATEGORIES } from './constants';
import { Person, UserRole } from './types';
import { TermsOfServicePage, PrivacyPolicyPage, AboutAIPage } from './components/LegalPages';


// Page Components
const MethodologyPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 py-10">
    <h1 className="text-6xl font-black tracking-tighter uppercase mb-10 italic">
      Методологія<span className="text-emerald-500">.ua</span>
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="glass p-8 rounded-[2.5rem] border-white/5">
        <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-emerald-500 italic">
          01. Джерела даних
        </h3>
        <p className="text-zinc-400 leading-relaxed font-medium">
          Ми приймаємо лише прямі посилання на відео, офіційні документи або верифіковані дописи у
          соціальних мережах. Посилання на анонімні Telegram-канали без додаткових доказів не
          розглядаються.
        </p>
      </div>
      <div className="glass p-8 rounded-[2.5rem] border-white/5">
        <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-emerald-500 italic">
          02. Процес верифікації
        </h3>
        <p className="text-zinc-400 leading-relaxed font-medium">
          Кожен запропонований пруф проходить три стадії: автоматичний ШІ-аналіз тональності,
          перевірка модератором та публічне голосування спільноти (Feedback Loop).
        </p>
      </div>
    </div>
  </motion.div>
);

const ContactPage = ({ subject }: { subject?: string }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto py-10">
    <h1 className="text-6xl font-black tracking-tighter uppercase mb-10 text-center italic">
      Контакти<span className="text-emerald-500">.ua</span>
    </h1>
    <div className="glass p-10 rounded-[3rem] border-emerald-500/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 text-emerald-500/5">
        <Mail size={120} />
      </div>
      <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="contact-name"
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block"
          >
            Ваше Ім'я або Організація
          </label>
          <input
            id="contact-name"
            type="text"
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 focus:ring-2 ring-emerald-500/50 outline-none transition-all"
            placeholder="Введіть дані..."
          />
        </div>
        <div>
          <label
            htmlFor="contact-subject"
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block"
          >
            Тема звернення
          </label>
          <input
            id="contact-subject"
            type="text"
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 focus:ring-2 ring-emerald-500/50 outline-none transition-all"
            placeholder="Тема..."
            defaultValue={subject}
          />
        </div>
        <div>
          <label
            htmlFor="contact-message"
            className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block"
          >
            Суть звернення
          </label>
          <textarea
            id="contact-message"
            className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 h-32 focus:ring-2 ring-emerald-500/50 outline-none transition-all"
            placeholder="Опишіть вашу пропозицію або скаргу..."
          ></textarea>
        </div>
        <button className="w-full bg-emerald-500 text-zinc-950 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
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
      <div className="glass p-6 rounded-[2rem] border-emerald-500/20 shadow-2xl flex flex-col space-y-4">
        <div className="flex items-start space-x-4">
          <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500 shrink-0">
            <Lock size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black uppercase tracking-widest">Приватність та анонімність</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">
              Ми використовуємо технічні методи ідентифікації (Browser Fingerprinting) виключно для захисту від спаму та атак. 
              Ми не збираємо ваші ПІБ, IP чи e-mail. Продовжуючи використання, ви погоджуєтесь на анонімну обробку даних.
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              localStorage.setItem('privacyAccepted', 'true');
              setIsOpen(false);
            }}
            className="flex-1 bg-emerald-500 text-zinc-950 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all"
          >
            Прийняти
          </button>
          <button
            onClick={() => (window.location.href = 'https://google.com')}
            className="px-6 py-3 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-zinc-500"
          >
            Вийти
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const LugaBusContent: React.FC = () => {
  const { user, people, loading, logout } = useAppContext();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Всі');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isAddFigureModalOpen, setIsAddFigureModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'methodology' | 'contact' | 'admin' | 'tos' | 'privacy' | 'about-ai'>(
    'home',
  );
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
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  } else if (filteredPeople.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPeople.map((p) => (
          <PersonCard key={p.id} person={p} onClick={setSelectedPerson} />
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
    <div className="min-h-screen pb-20 bg-zinc-950 text-zinc-100 selection:bg-primary/30">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-40 px-6 md:px-12 py-5 flex justify-between items-center mb-10 border-b border-white/5 backdrop-blur-2xl">
        <button
          className="flex items-center space-x-3 cursor-pointer group bg-transparent border-none p-0"
          onClick={() => setCurrentPage('home')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setCurrentPage('home');
          }}
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary overflow-hidden shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <img src="/logo.svg" alt="LugaBus" className="w-full h-full object-cover scale-110" />
          </div>
          <div className="flex items-baseline font-montserrat tracking-tight text-2xl uppercase italic">
            <span className="font-bold text-white">Luga</span>
            <span className="font-medium text-primary">bus</span>
            <span className="font-normal text-sm ml-0.5 text-zinc-500">.org</span>
          </div>
        </button>

        <div className="hidden lg:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          <button
            className={`hover:text-primary-light transition-colors ${currentPage === 'home' ? 'text-primary-light underline underline-offset-8' : ''}`}
            onClick={() => setCurrentPage('home')}
          >
            Реєстр
          </button>
          <button
            className={`hover:text-primary-light transition-colors ${currentPage === 'methodology' ? 'text-primary-light underline underline-offset-8' : ''}`}
            onClick={() => setCurrentPage('methodology')}
          >
            Методологія
          </button>
          <button
            className={`hover:text-primary-light transition-colors flex items-center ${currentPage === 'about-ai' ? 'text-primary-light underline underline-offset-8' : ''}`}
            onClick={() => setCurrentPage('about-ai')}
          >
            <Brain size={12} className="mr-2 opacity-50" />
            Як працює ШІ
          </button>
          <button
            className={`hover:text-primary-light transition-colors ${currentPage === 'contact' ? 'text-primary-light underline underline-offset-8' : ''}`}
            onClick={() => {
              setContactSubject(undefined);
              setCurrentPage('contact');
            }}
          >
            Контакти
          </button>

          {(user?.role === UserRole.ADMIN || user?.role === UserRole.MODERATOR) && (
            <button
              onClick={() => setCurrentPage('admin')}
              className={`flex items-center px-4 py-2 rounded-xl transition-all border ${currentPage === 'admin' ? 'bg-primary border-primary text-zinc-950 shadow-lg shadow-primary/20' : 'bg-white/5 border-white/5 text-primary hover:bg-primary/10'}`}
            >
              <Shield size={14} className="mr-2" /> Адмін
            </button>
          )}
        </div>

        <div className="flex items-center">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right leading-none">
                <p className="text-xs font-black tracking-tight text-primary">
                  {user.nickname || user.username}
                </p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">
                  {user.role} • {user.username}
                </p>
              </div>
              <div
                className="relative group cursor-help"
                title={`Анонімний профіль: ${user.nickname}`}
              >
                {user.avatarSvg ? (
                  <div
                    className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                    dangerouslySetInnerHTML={{ __html: user.avatarSvg }}
                  />
                ) : (
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${user.username}&background=random`
                    }
                    alt={`${user.username}'s avatar`}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/20"
                  />
                )}
              </div>
              <button
                onClick={logout}
                className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="scale-90 origin-right">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all group"
              >
                <div className="bg-primary/10 p-2 rounded-lg mr-3 group-hover:bg-primary group-hover:text-zinc-950 transition-colors text-primary">
                  <LogIn size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold group-hover:text-zinc-400">
                    Кабінет
                  </p>
                  <p className="text-xs font-black text-white group-hover:text-primary transition-colors">
                    Вхід / Реєстрація
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <StatsBar />
              {/* Filters Section */}
              <div className="flex flex-col lg:flex-row gap-4 mb-10 items-stretch">
                <div className="relative flex-1 group">
                  <Search
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="ПОШУК ЗА ПРІЗВИЩЕМ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full glass bg-zinc-900/40 py-4 pl-14 pr-6 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-black uppercase text-[11px] tracking-widest"
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-2 space-y-2 sm:space-y-0 overflow-x-auto pb-4 lg:pb-0 no-scrollbar items-center">
                  {user && (
                    <button
                      onClick={() => setIsAddFigureModalOpen(true)}
                      className="px-6 py-3.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase whitespace-nowrap transition-all border h-full flex items-center bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-zinc-950"
                    >
                      <Plus size={14} className="mr-2" /> Додати особу
                    </button>
                  )}
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-6 py-3.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase whitespace-nowrap transition-all border h-full flex items-center ${selectedCategory === cat ? 'bg-emerald-500 border-emerald-400 text-zinc-950' : 'glass bg-zinc-900/20 text-zinc-500 hover:text-zinc-200 border-white/5'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {content}
            </motion.div>
          )}

          {currentPage === 'methodology' && <MethodologyPage key="methodology" />}
          {currentPage === 'contact' && <ContactPage key="contact" subject={contactSubject} />}
          {currentPage === 'admin' && <AdminDashboard key="admin" />}
          {currentPage === 'tos' && <TermsOfServicePage key="tos" />}
          {currentPage === 'privacy' && <PrivacyPolicyPage key="privacy" />}
          {currentPage === 'about-ai' && <AboutAIPage key="about-ai" />}
        </AnimatePresence>
      </main>

      {/* Detail Modal Container */}
      <PersonModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
      <AddFigureModal
        isOpen={isAddFigureModalOpen}
        onClose={() => setIsAddFigureModalOpen(false)}
        onSuccess={() => {
          // Could refresh data here if needed, but since it goes to PENDING it won't show up anyway
          alert('Дані надіслано на перевірку!');
        }}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Global Footer */}
      <footer className="max-w-7xl mx-auto px-6 mt-32 py-10 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="bg-zinc-800 w-8 h-8 flex items-center justify-center rounded-lg text-emerald-500 font-black text-xs">
              LB
            </div>
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
              © 2026 LugaBus Project.ua
            </p>
          </div>
          <div className="flex space-x-8 text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <button
              onClick={() => setCurrentPage('tos')}
              className="hover:text-primary transition-colors"
            >
              Умови використання
            </button>
            <button
              onClick={() => setCurrentPage('privacy')}
              className="hover:text-primary transition-colors"
            >
              Конфіденційність
            </button>
            <button
              onClick={() => {
                setContactSubject('Report Abuse / Privacy Request');
                setCurrentPage('contact');
              }}
              className="hover:text-danger transition-colors"
            >
              Скарга / Privacy Request
            </button>
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
