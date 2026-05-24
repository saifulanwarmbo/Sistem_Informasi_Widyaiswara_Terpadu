

export interface PromotionHistoryItem {
  id: string;
  year: string;
  newTier: string;
  notes: string;
}

export interface DevelopmentHistoryItem {
  id: string;
  year: string;
  trainingName: string;
  organizer: string;
}

export interface PerformanceHistoryItem {
  id: string;
  year: string;
  performanceDescription: string;
  notes: string;
}

export enum JobTier {
  AhliPertama = 'Widyaiswara Ahli Pertama',
  AhliMuda = 'Widyaiswara Ahli Muda',
  AhliMadya = 'Widyaiswara Ahli Madya',
  AhliUtama = 'Widyaiswara Ahli Utama',
}

export interface WidyaiswaraProfile {
  id: string;
  name: string;
  photoUrl: string;
  tier: JobTier;
  organization: string;
  creditPoints: number;
  nip: string; // NIP = Nomor Induk Pegawai
  niwn: string; // NIWN = Nomor Induk Widyaiswara Nasional
  createdAt: number; // Timestamp of creation
  promotionHistory?: PromotionHistoryItem[];
  developmentHistory?: DevelopmentHistoryItem[];
  performanceHistory?: PerformanceHistoryItem[];
  ownerId: string;
}

export interface Organization {
  id: string;
  name: string;
  widyaiswaraCount: {
    [JobTier.AhliPertama]: number;
    [JobTier.AhliMuda]: number;
    [JobTier.AhliMadya]: number;
    [JobTier.AhliUtama]: number;
  };
  total: number;
}

export type RegistrationStatus = 'pending' | 'verified' | 'rejected';

export interface CompetencyDocument {
  name: string;
  url: string;
}

export interface CompetencyRegistration {
  id: string;
  profileId: string;
  ownerId: string;
  status: RegistrationStatus;
  documents: CompetencyDocument[];
  submissionDate: number;
  verificationDate?: number;
  adminNotes?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export type UserRole = 'admin' | 'widyaiswara';

export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: number;
}