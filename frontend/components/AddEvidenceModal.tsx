import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Link2,
  FileText,
  Image,
  Video,
  Vote,
  Trash2,
  Send,
  AlertCircle,
} from 'lucide-react';
import { apiService, ApiError } from '../services/apiService';
import { useAppContext } from '../store/AppContext';

interface EvidenceItem {
  url: string;
  title: string;
  type: 'LINK' | 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'VOTE_RECORD';
  polarity: 'SUPPORT' | 'REFUTE';
}

interface AddEvidenceModalProps {
  personId: string;
  personName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const evidenceTypes = [
  { value: 'LINK', label: 'Посилання', icon: Link2 },
  { value: 'IMAGE', label: 'Зображення', icon: Image },
  { value: 'DOCUMENT', label: 'Документ', icon: FileText },
  { value: 'VIDEO', label: 'Відео', icon: Video },
  { value: 'VOTE_RECORD', label: 'Голосування ВРУ', icon: Vote },
] as const;

const AddEvidenceModal: React.FC<AddEvidenceModalProps> = ({
  personId,
  personName,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [evidences, setEvidences] = useState<EvidenceItem[]>([
    { url: '', title: '', type: 'LINK', polarity: 'SUPPORT' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const { showToast } = useAppContext();

  const handleAddEvidence = () => {
    setEvidences([...evidences, { url: '', title: '', type: 'LINK', polarity: 'SUPPORT' }]);
  };

  const handleRemoveEvidence = (index: number) => {
    if (evidences.length > 1) {
      setEvidences(evidences.filter((_, i) => i !== index));
    }
  };

  const handleEvidenceChange = (index: number, field: keyof EvidenceItem, value: string) => {
    const updated = [...evidences];
    updated[index] = { ...updated[index], [field]: value };
    setEvidences(updated);
  };

  const validateForm = (validEvidences: EvidenceItem[]) => {
    if (validEvidences.length === 0) {
      setError('Додайте хоча б одне посилання на доказ');
      return false;
    }

    // URL validation
    for (const evidence of validEvidences) {
      if (evidence.url.trim()) {
        try {
          new URL(evidence.url);
        } catch {
          setError(`Невірний URL: ${evidence.url}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    setFieldErrors({});

    const validEvidences = evidences.filter((e) => e.url.trim() !== '');
    if (!validateForm(validEvidences)) return;

    setIsSubmitting(true);

    try {
      await apiService.createRevision({
        personId,
        proposedData: {}, // No changes to person data, just adding evidence
        reason: reason || undefined,
        evidences: validEvidences.map((e) => ({
          url: e.url,
          title: e.title || undefined,
          type: e.type,
          polarity: e.polarity,
        })),
      });

      setSuccess(true);
      showToast('Доказ успішно надіслано на модерацію');
      setTimeout(() => {
        onSuccess?.();
        onClose();
        // Reset form
        setReason('');
        setEvidences([{ url: '', title: '', type: 'LINK', polarity: 'SUPPORT' }]);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const errors: Record<string, string> = {};
        err.errors.forEach((e) => {
          errors[e.field] = e.message;
        });
        setFieldErrors(errors);
        setError('Перевірте правильність заповнення полів');
      } else {
        setError(err instanceof Error ? err.message : 'Помилка при відправці');
        showToast(err instanceof Error ? err.message : 'Помилка при відправці', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl max-h-[85vh] bg-zinc-950 overflow-hidden flex flex-col shadow-2xl border border-white/10"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Запропонувати доказ</h2>
              <p className="text-sm text-zinc-500 mt-1">
                для <span className="text-red-500 font-bold">{personName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 bg-zinc-900/50 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-20 h-20 rounded-none bg-red-500/20 flex items-center justify-center mb-4">
                  <Send className="text-red-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-red-500 mb-2">Доказ надіслано!</h3>
                <p className="text-zinc-500 text-sm">
                  Ваша пропозиція буде розглянута модераторами
                </p>
              </motion.div>
            ) : (
              <>
                {/* Reason */}
                <div>
                  <label
                    htmlFor="reason-comment"
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 block mb-3 cursor-pointer"
                  >
                    Коментар (необов'язково)
                  </label>
                  <textarea
                    id="reason-comment"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Опишіть контекст доказу..."
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-none p-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 resize-none h-24"
                  />
                  {fieldErrors.reason && (
                    <p className="text-red-400 text-[10px] mt-2 ml-1 flex items-center gap-1 font-bold uppercase tracking-wider">
                      <AlertCircle size={10} /> {fieldErrors.reason}
                    </p>
                  )}
                </div>

                {/* Evidence List */}
                <div id="evidence-list-label">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 block mb-3">
                    Докази
                  </span>

                  <div className="space-y-4">
                    {evidences.map((evidence, index) => (
                      <div
                        key={`${index}-${evidence.type}`}
                        className="bg-zinc-900/40 p-4 rounded-2xl border border-white/5 space-y-3"
                      >
                        <div className="flex gap-3">
                          {/* URL Input */}
                          <div className="flex-1">
                            <input
                              type="url"
                              value={evidence.url}
                              onChange={(e) => handleEvidenceChange(index, 'url', e.target.value)}
                              placeholder="https://..."
                              className="w-full bg-zinc-800/50 border border-white/10 rounded-none px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50"
                            />
                            {fieldErrors[`evidences.${index}.url`] && (
                              <p className="text-red-400 text-[10px] mt-2 ml-1 flex items-center gap-1 font-bold uppercase tracking-wider">
                                <AlertCircle size={10} /> {fieldErrors[`evidences.${index}.url`]}
                              </p>
                            )}
                          </div>

                          {/* Remove Button */}
                          {evidences.length > 1 && (
                            <button
                              onClick={() => handleRemoveEvidence(index)}
                              className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 transition-colors h-fit"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>

                        {/* Title */}
                        <div>
                          <input
                            type="text"
                            value={evidence.title}
                            onChange={(e) => handleEvidenceChange(index, 'title', e.target.value)}
                            placeholder="Назва (необов'язково)"
                            className="w-full bg-zinc-800/50 border border-white/10 rounded-none px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50"
                          />
                          {fieldErrors[`evidences.${index}.title`] && (
                            <p className="text-red-400 text-[10px] mt-2 ml-1 flex items-center gap-1 font-bold uppercase tracking-wider">
                              <AlertCircle size={10} /> {fieldErrors[`evidences.${index}.title`]}
                            </p>
                          )}
                        </div>

                        {/* Type & Polarity */}
                        <div className="flex gap-3">
                          <select
                            value={evidence.type}
                            onChange={(e) =>
                              handleEvidenceChange(
                                index,
                                'type',
                                e.target.value as EvidenceItem['type'],
                              )
                            }
                            className="flex-1 bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                          >
                            {evidenceTypes.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>

                          <select
                            value={evidence.polarity}
                            onChange={(e) =>
                              handleEvidenceChange(
                                index,
                                'polarity',
                                e.target.value as EvidenceItem['polarity'],
                              )
                            }
                            className="flex-1 bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                          >
                            <option value="SUPPORT">✅ Підтверджує</option>
                            <option value="REFUTE">❌ Спростовує</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add More Button */}
                  <button
                    onClick={handleAddEvidence}
                    className="mt-4 w-full py-3 border border-dashed border-zinc-700 rounded-none text-zinc-500 hover:text-red-500 hover:border-red-500/50 transition-all font-black text-xs tracking-widest uppercase flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Додати ще доказ
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!success && (
            <div className="p-6 border-t border-white/5 bg-white/5">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-red-700 hover:bg-red-600 rounded-none text-white font-black text-sm tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Надсилання...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Надіслати доказ
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddEvidenceModal;
