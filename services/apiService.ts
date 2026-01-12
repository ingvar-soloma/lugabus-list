
import { MOCK_PEOPLE, MOCK_USER } from '../constants';
import { Person, Stats, User, PoliticalPosition, Proof } from '../types';

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  async fetchPeople(): Promise<Person[]> {
    await delay(600);
    return [...MOCK_PEOPLE];
  }

  async getStats(): Promise<Stats> {
    await delay(400);
    const people = MOCK_PEOPLE;
    return {
      totalMonitored: people.length,
      betrayalCount: people.filter(p => p.position === PoliticalPosition.BETRAYAL).length,
      supportCount: people.filter(p => p.position === PoliticalPosition.SUPPORT).length,
      pendingProofs: 5,
      weeklyActivity: 124
    };
  }

  async login(): Promise<User> {
    await delay(800);
    return MOCK_USER;
  }

  async submitProof(personId: string, proof: Partial<Proof>): Promise<boolean> {
    await delay(1000);
    console.log(`Proof submitted for ${personId}:`, proof);
    return true;
  }

  async voteProof(proofId: string, type: 'like' | 'dislike'): Promise<boolean> {
    await delay(200);
    console.log(`Voted ${type} for proof ${proofId}`);
    return true;
  }

  async updatePersonPosition(personId: string, position: PoliticalPosition): Promise<boolean> {
    await delay(500);
    console.log(`Admin updated ${personId} to ${position}`);
    return true;
  }
}

export const apiService = new ApiService();
