
import { MOCK_PEOPLE, MOCK_USER, MOCK_ADMIN_USERS } from '../constants';
import { Person, Stats, User, PoliticalPosition, Proof, AuditLog, AIInsight } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  async fetchPeople(): Promise<Person[]> {
    await delay(400);
    return [...MOCK_PEOPLE];
  }

  async fetchUsers(): Promise<User[]> {
    await delay(300);
    return [...MOCK_ADMIN_USERS];
  }

  async getStats(): Promise<Stats> {
    await delay(200);
    const people = MOCK_PEOPLE;
    return {
      totalMonitored: people.length,
      betrayalCount: people.filter(p => p.position === PoliticalPosition.BETRAYAL).length,
      supportCount: people.filter(p => p.position === PoliticalPosition.SUPPORT).length,
      pendingProofs: 14,
      weeklyActivity: 124
    };
  }

  async login(): Promise<User> {
    await delay(500);
    return MOCK_USER;
  }

  async fetchAuditLogs(): Promise<AuditLog[]> {
    await delay(300);
    return [
      { id: 'l1', adminId: 'u-1', adminName: 'Admin_User', action: 'Зміна статусу', targetId: '1', targetName: 'Олександр Петров', timestamp: '2024-05-20 14:30' },
      { id: 'l2', adminId: 'u-1', adminName: 'Admin_User', action: 'Додавання пруфу', targetId: '2', targetName: 'Марія Патріотка', timestamp: '2024-05-20 12:15' },
    ];
  }

  async fetchAIInsights(): Promise<AIInsight[]> {
    await delay(400);
    return [
      { id: 'ai1', targetId: '1', confidence: 0.89, sentiment: 'NEGATIVE', summary: 'Виявлено високий рівень маніпулятивних наративів у останній заяві.' },
      { id: 'ai2', targetId: '2', confidence: 0.95, sentiment: 'POSITIVE', summary: 'Діяльність повністю відповідає критеріям патріотичної позиції.' },
    ];
  }

  async voteProof(proofId: string, type: 'like' | 'dislike'): Promise<boolean> {
    await delay(100);
    console.log(`Voted ${type} for proof ${proofId}`);
    return true;
  }
}

export const apiService = new ApiService();
