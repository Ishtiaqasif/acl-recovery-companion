export interface ProgressEntry {
  id?: string;
  user?: string;
  date: Date;
  painLevel: number;
  swelling: 'none' | 'mild' | 'moderate' | 'severe';
  flexion: number;
  extension: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProgressResponse {
  success: boolean;
  data: ProgressEntry;
}

export interface ProgressListResponse {
  success: boolean;
  count: number;
  data: ProgressEntry[];
}