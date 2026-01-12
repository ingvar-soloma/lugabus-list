
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Person, Stats, UserRole } from '../types';
import { apiService } from '../services/apiService';

interface AppContextType {
  user: User | null;
  people: Person[];
  stats: Stats | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [peopleData, statsData] = await Promise.all([
        apiService.fetchPeople(),
        apiService.getStats()
      ]);
      setPeople(peopleData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    const userData = await apiService.login();
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider value={{ user, people, stats, loading, login, logout, refreshData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
