import { Timestamp } from 'firebase/firestore';

export interface SafelistLink {
  id: string;
  name: string;
  url: string;
  frequency: number;
  isActive: boolean;
  category: string;
  userId: string;
  notes?: string;
  lastSubmitted?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt?: Timestamp | null;
}
