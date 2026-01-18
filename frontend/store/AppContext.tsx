import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { User, Person, Stats } from '../types';
import { apiService } from '../services/apiService';
import { ToastContainer, ToastType } from '../components/Toast';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  people: Person[];
  stats: Stats | null;
  loading: boolean;
  login: (telegramData: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  refreshData: () => Promise<void>;
  showToast: (message: string, type?: ToastType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: ToastType }[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [peopleData, statsData] = await Promise.all([
        apiService.fetchPeople(),
        apiService.getStats(),
      ]);
      setPeople(peopleData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch data', error);
      showToast('Помилка оновлення даних', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (telegramData: Record<string, unknown>) => {
      try {
        const userData = await apiService.handleTelegramLogin(telegramData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        showToast('Вхід виконано успішно');
        await refreshData();
      } catch (error) {
        console.error('Login failed', error);
        showToast('Помилка при вході', 'error');
        throw error;
      }
    },
    [refreshData],
  );

  const logout = useCallback(async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    showToast('Ви вийшли з аккаунту', 'info');
    await refreshData();
  }, [refreshData]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      if (token) {
        try {
          const userData = await apiService.getMe();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      await refreshData();
    };
    initAuth();
  }, [refreshData]);

  const contextValue = useMemo(
    () => ({ user, setUser, people, stats, loading, login, logout, refreshData, showToast }),
    [user, people, stats, loading, login, logout, refreshData, showToast],
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
