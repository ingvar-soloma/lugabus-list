import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, UserPlus, Info } from 'lucide-react';
import { apiService } from '../services/apiService';

interface AddFigureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddFigureModal: React.FC<AddFigureModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    statement: '',
    rating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiService.createFigure(formData);
      onSuccess();
      onClose();
      setFormData({ name: '', role: '', statement: '', rating: 0 });
    } catch (err) {
      setError((err as Error).message || 'Помилка при додаванні');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl glass rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border border-white/10"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-500/20 p-3 rounded-2xl">
                <UserPlus size={24} className="text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter">ДОДАТИ ОСОБУ</h2>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                  Надіслати на розгляд модератора
                </p>
              </div>
            </div>
            <button
              aria-label="Close modal"
              onClick={onClose}
              className="p-2.5 bg-zinc-900/50 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold uppercase tracking-widest flex items-center">
                <Info size={16} className="mr-2" /> {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block"
              >
                Прізвище та Ім'я
              </label>
              <input
                id="name"
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 focus:ring-2 ring-emerald-500/50 outline-none transition-all font-medium"
                placeholder="Введіть повне ім'я..."
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block"
              >
                Роль / Посада
              </label>
              <input
                id="role"
                required
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 focus:ring-2 ring-emerald-500/50 outline-none transition-all font-medium"
                placeholder="Наприклад: Депутат, Журналіст..."
              />
            </div>

            <div>
              <label
                htmlFor="statement"
                className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block"
              >
                Суть діяльності (Опис/Заява)
              </label>
              <textarea
                id="statement"
                required
                value={formData.statement}
                onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 h-32 focus:ring-2 ring-emerald-500/50 outline-none transition-all font-medium"
                placeholder="Опишіть діяльність особи або її основні заяви..."
              ></textarea>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
              <div className="flex-1">
                <label
                  htmlFor="rating"
                  className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1 block"
                >
                  Попередня оцінка
                </label>
                <p className="text-[9px] text-emerald-500/50 leading-tight uppercase font-bold">
                  Оцінка від -100 (зрада) до +100 (підтримка)
                </p>
              </div>
              <input
                id="rating"
                type="number"
                min="-100"
                max="100"
                value={formData.rating}
                onChange={(e) => {
                  const val = Number.parseInt(e.target.value);
                  setFormData({ ...formData, rating: Number.isNaN(val) ? 0 : val });
                }}
                className="w-24 bg-zinc-900 border border-white/10 rounded-xl p-3 text-center font-black text-emerald-500 outline-none focus:ring-2 ring-emerald-500/30"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-emerald-500 disabled:bg-emerald-500/20 disabled:text-zinc-500 text-zinc-950 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center space-x-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send size={18} />
                  <span>Надіслати на розгляд</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddFigureModal;
