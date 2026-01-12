
import React, { useState, useMemo } from 'react';
import { AppProvider, useAppContext } from './store/AppContext';
import { Search, Filter, LogIn, Shield, LogOut, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatsBar from './components/StatsBar';
import PersonCard from './components/PersonCard';
import PersonModal from './components/PersonModal';
import AdminDashboard from './components/AdminDashboard';
import { CATEGORIES } from './constants';
import { Person, PoliticalPosition, UserRole } from './types';

const LugaBusContent: React.FC = () => {
  const { user, people, loading, login, logout } = useAppContext();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Всі');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [view, setView] = useState<'grid' | 'admin'>('grid');

  const filteredPeople = useMemo(() => {
    return people
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'Всі' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => b.score - a.score);
  }, [people, search, selectedCategory]);

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-40 px-4 md:px-8 py-4 flex justify-between items-center mb-8 border-b border-white/5">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('grid')}>
          <div className="bg-blue-600 p-2 rounded-xl text-white font-black text-xl">LB</div>
          <span className="text-2xl font-black tracking-tighter">LugaBus<span className="text-blue-500">.ua</span></span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6 text-sm font-bold text-slate-400">
          <button className="hover:text-white transition-colors" onClick={() => setView('grid')}>Головна</button>
          <button className="hover:text-white transition-colors">Методологія</button>
          <button className="hover:text-white transition-colors">Зворотний зв'язок</button>
          {user?.role === UserRole.ADMIN && (
             <button 
              onClick={() => setView(view === 'admin' ? 'grid' : 'admin')}
              className={`flex items-center px-4 py-2 rounded-xl transition-all ${view === 'admin' ? 'bg-blue-600 text-white' : 'bg-white/5 text-blue-400 hover:bg-white/10'}`}
             >
               <Shield size={16} className="mr-2" /> Адмін
             </button>
          )}
        </div>

        <div>
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold">{user.username}</p>
                <p className="text-[10px] text-slate-500 uppercase">{user.role}</p>
              </div>
              <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/20" />
              <button onClick={logout} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20"
            >
              <LogIn size={18} />
              <span>Увійти</span>
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4">
        {view === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            <StatsBar />

            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Пошук за прізвищем..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full glass bg-slate-900/50 py-4 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-blue-600 border-blue-500 text-white' : 'glass text-slate-400 hover:text-white border-white/5'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold animate-pulse">Завантажуємо реєстр...</p>
              </div>
            ) : filteredPeople.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredPeople.map(p => (
                  <PersonCard key={p.id} person={p} onClick={setSelectedPerson} />
                ))}
              </motion.div>
            ) : (
              <div className="h-96 glass rounded-3xl flex flex-col items-center justify-center text-center p-8">
                <AlertCircle size={48} className="text-slate-700 mb-4" />
                <h3 className="text-xl font-bold mb-2">Нікого не знайдено</h3>
                <p className="text-slate-500 max-w-sm">
                  Ми не змогли знайти особу за вашим запитом. Спробуйте змінити фільтри або написати нам, щоб ми додали нову картку.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Methodology Banner */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="glass p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between border-2 border-blue-500/10 bg-gradient-to-br from-blue-600/5 to-transparent">
          <div className="mb-6 md:mb-0 md:mr-10">
            <h2 className="text-3xl font-black mb-4">Як ми формуємо рейтинг?</h2>
            <p className="text-slate-400 max-w-xl leading-relaxed">
              LugaBus.ua — це децентралізована платформа. Кожен голос та пруф перевіряються модераторами та спільнотою. Ми базуємося лише на публічних заявах, відеодоказах та офіційних документах.
            </p>
          </div>
          <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-8 py-4 rounded-3xl font-black transition-all group">
             <Info size={20} className="group-hover:rotate-12 transition-transform" />
             <span>ПОВНА МЕТОДОЛОГІЯ</span>
          </button>
        </div>
      </section>

      {/* Detail Modal */}
      <PersonModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 mt-20 text-center text-slate-600 text-sm">
        <p>© 2023 LugaBus.ua — Платформа громадського контролю. Разом до перемоги.</p>
        <div className="flex justify-center space-x-4 mt-4 uppercase font-black text-[10px] tracking-widest">
          <a href="#" className="hover:text-blue-500">Політика конфіденційності</a>
          <span>•</span>
          <a href="#" className="hover:text-blue-500">API для розробників</a>
          <span>•</span>
          <a href="#" className="hover:text-blue-500">Telegram Бот</a>
        </div>
      </footer>
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
