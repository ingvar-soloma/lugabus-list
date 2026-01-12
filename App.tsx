
import React, { useState, useMemo } from 'react';
import { AppProvider, useAppContext } from './store/AppContext';
import { Search, Shield, LogOut, LogIn, Info, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import StatsBar from './components/StatsBar';
import PersonCard from './components/PersonCard';
import PersonModal from './components/PersonModal';
import AdminDashboard from './components/AdminDashboard';
import { CATEGORIES } from './constants';
import { Person, UserRole } from './types';

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
    <div className="min-h-screen pb-20 bg-zinc-950 text-zinc-100">
      {/* Navigation */}
      <nav className="glass sticky top-0 z-40 px-6 md:px-12 py-5 flex justify-between items-center mb-10 border-b border-white/5 backdrop-blur-2xl">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setView('grid')}>
          <div className="bg-emerald-500 w-10 h-10 flex items-center justify-center rounded-xl text-zinc-950 font-black text-xl shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-105">LB</div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">LugaBus<span className="text-emerald-500">.ua</span></span>
        </div>
        
        <div className="hidden lg:flex items-center space-x-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
          <button className="hover:text-emerald-400 transition-colors" onClick={() => setView('grid')}>Реєстр</button>
          <button className="hover:text-emerald-400 transition-colors">Методи</button>
          <button className="hover:text-emerald-400 transition-colors">Контакт</button>
          {user?.role === UserRole.ADMIN && (
             <button 
              onClick={() => setView(view === 'admin' ? 'grid' : 'admin')}
              className={`flex items-center px-4 py-2 rounded-xl transition-all border ${view === 'admin' ? 'bg-emerald-600 border-emerald-500 text-zinc-950' : 'bg-white/5 border-white/5 text-emerald-500 hover:bg-emerald-500/10'}`}
             >
               <Shield size={14} className="mr-2" /> Адмін
             </button>
          )}
        </div>

        <div className="flex items-center">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right leading-none">
                <p className="text-xs font-black tracking-tight">{user.username}</p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">{user.role}</p>
              </div>
              <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/20" />
              <button onClick={logout} className="p-2 text-zinc-600 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-2.5 rounded-xl font-black tracking-tight transition-all shadow-lg shadow-emerald-500/20 uppercase text-xs active:scale-95"
            >
              <LogIn size={16} />
              <span>Вхід</span>
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        {view === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            <StatsBar />

            {/* Filters Section */}
            <div className="flex flex-col lg:flex-row gap-4 mb-10 items-stretch">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="ПОШУК ПРІЗВИЩА..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full glass bg-zinc-900/40 py-3.5 pl-14 pr-6 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-black uppercase text-[11px] tracking-widest"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar items-center">
                {CATEGORIES.map(cat => (
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

            {/* Main Content Area */}
            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center space-y-6">
                <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-zinc-500 text-xs font-black tracking-widest uppercase animate-pulse">Зчитування даних...</p>
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
              <div className="h-96 glass rounded-3xl flex flex-col items-center justify-center text-center p-12 border-white/5">
                <AlertCircle size={40} className="text-zinc-800 mb-6" />
                <h3 className="text-2xl font-black tracking-tight mb-2">РЕЗУЛЬТАТІВ НЕМАЄ</h3>
                <p className="text-zinc-500 max-w-sm text-sm font-medium leading-relaxed">
                  Немає збігів за даними фільтрами. Спробуйте інший запит або перевірте категорію.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Methodology Section */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="glass p-12 rounded-[3rem] flex flex-col lg:flex-row items-center justify-between border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
          <div className="mb-8 lg:mb-0 lg:mr-16 relative z-10">
            <h2 className="text-4xl font-black tracking-tighter mb-6 uppercase">Прозорість понад усе</h2>
            <p className="text-zinc-400 max-w-2xl text-lg font-medium leading-relaxed">
              LugaBus.ua — це інструмент громадського аудиту. Наша система ґрунтується на відкритих даних, цифрових слідах та відео-пруфах. Кожен рейтинг — це результат колективного аналізу.
            </p>
          </div>
          <button className="flex items-center space-x-3 bg-zinc-100 hover:bg-white text-zinc-950 px-10 py-5 rounded-2xl font-black transition-all group relative z-10 active:scale-95 shadow-xl shadow-white/5 uppercase text-xs tracking-widest">
             <Info size={18} />
             <span>Перейти до методології</span>
          </button>
        </div>
      </section>

      {/* Detail Modal Container */}
      <PersonModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />

      {/* Global Footer */}
      <footer className="max-w-7xl mx-auto px-6 mt-32 py-10 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">© 2024 LugaBus Project</p>
          <div className="flex space-x-8 text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Dev API</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Support</a>
          </div>
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
