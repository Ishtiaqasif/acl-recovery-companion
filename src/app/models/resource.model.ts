export interface Resource {
  id?: string;
  title: string;
  description: string;
  contentType: 'article' | 'video' | 'pdf' | 'link' | 'exercise';
  url?: string;
  content?: string;
  author: string;
  source?: string;
  recoveryPhase: 'all' | 'pre-op' | 'early-recovery' | 'strength-building' | 'advanced-training' | 'return-to-sport';
  tags?: string[];
  viewCount?: number;
  featured?: boolean;
  approved?: boolean;
  submittedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResourceResponse {
  success: boolean;
  data: Resource;
}

export interface ResourceListResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Resource[];
}

export interface ResourceFilters {
  page?: number;
  limit?: number;
  contentType?: string;
  recoveryPhase?: string;
  tag?: string;
  featured?: boolean;
  search?: string;
}