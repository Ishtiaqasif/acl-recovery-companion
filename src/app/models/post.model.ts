export interface Comment {
  id?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  content: string;
  createdAt: Date;
}

export interface Post {
  id?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  title: string;
  content: string;
  category: 'success-story' | 'question' | 'support' | 'general' | 'tip';
  likes: string[];
  comments: Comment[];
  tags?: string[];
  recoveryPhase: 'pre-op' | 'early-recovery' | 'strength-building' | 'advanced-training' | 'return-to-sport';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostResponse {
  success: boolean;
  data: Post;
}

export interface PostListResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Post[];
}

export interface PostFilters {
  page?: number;
  limit?: number;
  category?: string;
  recoveryPhase?: string;
  tag?: string;
  search?: string;
}