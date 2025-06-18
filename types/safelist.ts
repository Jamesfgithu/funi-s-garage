export interface SafelistLink {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
  userId: string;
  isActive: boolean;
  lastSubmitted?: Date | null;
  frequency: number;
  notes?: string; // Optional notes field
}
