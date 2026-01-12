
export enum PoliticalPosition {
  SUPPORT = 'SUPPORT',     // За Україну
  BETRAYAL = 'BETRAYAL',   // Проти / Зашквар
  NEUTRAL = 'NEUTRAL'      // Морозиться / Невизначено
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

export interface Proof {
  id: string;
  text: string;
  sourceUrl: string;
  date: string;
  likes: number;
  dislikes: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  position: PoliticalPosition;
}

export interface Person {
  id: string;
  name: string;
  description: string;
  avatar: string;
  category: string;
  position: PoliticalPosition;
  score: number;
  proofsCount: number;
  lastUpdated: string;
  proofs: Proof[];
  history: TimelineEvent[];
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  avatar?: string;
}

export interface Stats {
  totalMonitored: number;
  betrayalCount: number;
  supportCount: number;
  pendingProofs: number;
  weeklyActivity: number;
}
