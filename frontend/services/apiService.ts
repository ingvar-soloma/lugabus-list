import { Person, Stats, User, AuditLog, AIInsight } from '../types';

const API_BASE_URL = '/api';

class ApiService {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async fetchPeople(): Promise<Person[]> {
    const response = await fetch(`${API_BASE_URL}/figures`);
    if (!response.ok) throw new Error('Failed to fetch people');
    return response.json();
  }

  async createFigure(data: {
    name: string;
    role: string;
    statement: string;
    rating?: number;
  }): Promise<Person> {
    const response = await fetch(`${API_BASE_URL}/figures`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create figure');
    return response.json();
  }

  async fetchUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }

  async getStats(): Promise<Stats> {
    const response = await fetch(`${API_BASE_URL}/figures/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  }

  async register(data: {
    username: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const { token } = await response.json();
    localStorage.setItem('token', token);

    return this.getMe();
  }

  async login(data: { username: string; password?: string }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const { token } = await response.json();
    localStorage.setItem('token', token);

    return this.getMe();
  }

  async handleTelegramLogin(data: Record<string, unknown>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Login failed');

    const { token } = await response.json();
    localStorage.setItem('token', token);

    // Decode token or fetch user profile
    return this.getMe();
  }

  async getMe(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }

  async fetchAuditLogs(): Promise<AuditLog[]> {
    const response = await fetch(`${API_BASE_URL}/admin/logs`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch logs');
    return response.json();
  }

  async fetchAIInsights(): Promise<AIInsight[]> {
    const response = await fetch(`${API_BASE_URL}/admin/ai-insights`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch AI insights');
    return response.json();
  }

  async voteProof(proofId: string, type: 'like' | 'dislike'): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/proofs/${proofId}/vote`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ type }),
    });
    return response.ok;
  }

  /**
   * Create a revision with evidence for a person
   */
  async createRevision(data: {
    personId: string;
    proposedData: Record<string, unknown>;
    reason?: string;
    evidences?: Array<{
      url: string;
      title?: string;
      type?: 'LINK' | 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'VOTE_RECORD';
      polarity?: 'SUPPORT' | 'REFUTE';
    }>;
  }): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/revisions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create revision');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
