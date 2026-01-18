export enum PoliticalPosition {
  SUPPORT = 'SUPPORT', // За Україну
  BETRAYAL = 'BETRAYAL', // Проти / Зашквар
  NEUTRAL = 'NEUTRAL', // Морозиться / Невизначено
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
  GUEST = 'GUEST',
}

export interface Proof {
  id: string;
  text: string;
  sourceUrl: string;
  date: string;
  likes: number;
  dislikes: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EDITS_REQUIRED';
  type?: 'LINK' | 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'VOTE_RECORD';
  submittedBy?: {
    nickname: string;
    avatarSvg: string;
  };
}

export interface AuditLog {
  id: string;
  userId: string;
  adminName?: string;
  action: string;
  targetId?: string;
  targetName?: string;
  details?: Record<string, unknown>;
  createdAt: string;
  timestamp?: string; // Compatibility with legacy bits
}

export interface AIInsight {
  id: string;
  targetId: string;
  confidence: number;
  sentiment: 'NEGATIVE' | 'POSITIVE' | 'NEUTRAL';
  summary: string;
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
  avatarSvg?: string;
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
  avatarSvg?: string;
  nickname?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  submissionsCount?: number;
  reputation?: number;
}

export interface Revision {
  id: string;
  personId: string;
  person?: {
    name: string;
  };
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  evidences?: Array<{
    url: string;
    title?: string;
    type: string;
    polarity: string;
  }>;
  authorIdentity?: {
    nickname: string;
    avatarSvg: string;
  };
  createdAt: string;
}

export interface Stats {
  totalMonitored: number;
  betrayalCount: number;
  supportCount: number;
  pendingProofs: number;
  weeklyActivity: number;
}
