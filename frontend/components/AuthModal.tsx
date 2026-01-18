import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
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
  const { setUser: setAppUser, login: appLogin, refreshData } = useAppContext();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
      await refreshData();
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramAuth = useCallback(
    async (data: Record<string, unknown>) => {
      setLoading(true);
      setError(null);
      try {
        await appLogin(data);
        onClose();
      } catch (err) {
        setError((err as Error).message || 'Telegram login failed');
      } finally {
        setLoading(false);
      }
    },
    [appLogin, onClose],
  );

  if (!isOpen) return null;

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
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-none p-8 shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        <div className="mb-8 text-center">
          <h2
            className="text-3xl font-black tracking-tighter uppercase mb-2"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {mode === 'login' ? 'Вхід' : 'Реєстрація'}
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
            {mode === 'login' ? 'Увійдіть, щоб продовжити' : 'Приєднуйтесь до спільноти LugaBus'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative group">
              <UserIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="ЛОГІН"
                value={formData.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-none py-4 pl-12 pr-4 focus:outline-none focus:border-red-800 transition-all font-bold text-xs tracking-widest uppercase"
                required
              />
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-red-500 transition-colors"
                size={18}
              />
              <input
                type="password"
                placeholder="ПАРОЛЬ"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-none py-4 pl-12 pr-4 focus:outline-none focus:border-red-800 transition-all font-bold text-xs tracking-widest uppercase"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-900/10 border border-red-900/20 rounded-none text-red-500 text-[10px] text-center font-black uppercase tracking-widest">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 text-white py-4 rounded-none font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-900/20 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <span>{mode === 'login' ? 'Увійти' : 'Зареєструватися'}</span>
            )}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="px-4 bg-zinc-900 text-zinc-600">або через Telegram</span>
          </div>
        </div>

        <div className="flex justify-center">
          <TelegramLogin
            botName={import.meta.env.VITE_TELEGRAM_BOT_NAME || 'lugabus_bot'}
            onAuth={handleTelegramAuth}
            cornerRadius={0}
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
            {mode === 'login' ? 'Ще не маєте акаунту? ' : 'Вже маєте акаунт? '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
                setFormData({ username: '', password: '' });
              }}
              className="text-red-500 hover:text-red-400 transition-colors"
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
