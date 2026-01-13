import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, Lock, ArrowRight, Loader } from 'lucide-react';
import { apiService } from '../services/apiService';
import TelegramLogin from './TelegramLogin';
import { useAppContext } from '../store/AppContext';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setUser: setAppUser } = useAppContext();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let user: User;
      if (mode === 'register') {
        user = await apiService.register(formData);
      } else {
        user = await apiService.login({ username: formData.username, password: formData.password });
      }
      setAppUser(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramAuth = async (user: any) => {
      setAppUser(user);
      onClose();
  };

  if (!isOpen) return null;

  // @ts-ignore
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
      >
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">
            {mode === 'login' ? 'Вхід' : 'Реєстрація'}
          </h2>
          <p className="text-zinc-500 text-sm font-medium">
            {mode === 'login' ? 'Увійдіть, щоб продовжити' : 'Приєднуйтесь до спільноти LugaBus'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Логін"
                value={formData.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                required
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="Пароль"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                required
              />
            </div>

            <AnimatePresence>
                {mode === 'register' && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-4 overflow-hidden"
                    >
                         <div className="grid grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder="Ім'я (опціонально)"
                                value={formData.firstName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, firstName: e.target.value})}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                            />
                            <input 
                                type="text" 
                                placeholder="Прізвище (опціонально)"
                                value={formData.lastName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, lastName: e.target.value})}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                            />
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center font-bold">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-500 text-zinc-950 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin" size={20}/> : <span>{mode === 'login' ? 'Увійти' : 'Зареєструватися'}</span>}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-zinc-900 text-zinc-500 font-medium">або через Telegram</span>
            </div>
        </div>

        <div className="flex justify-center">
             <TelegramLogin 
                botName={import.meta.env.VITE_TELEGRAM_BOT_NAME || 'lugabus_bot'} 
                onAuth={handleTelegramAuth} 
                cornerRadius={12}
              />
        </div>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm font-medium">
            {mode === 'login' ? 'Ще не маєте акаунту? ' : 'Вже маєте акаунт? '}
            <button 
              onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError(null);
                  setFormData({ username: '', password: '', firstName: '', lastName: '' });
              }}
              className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors"
            >
              {mode === 'login' ? 'Зареєструватися' : 'Увійти'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
