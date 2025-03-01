export interface Goal {
  id?: string;
  user?: string;
  name: string;
  description: string;
  target: Date;
  category: 'mobility' | 'strength' | 'activity' | 'pain';
  achieved: boolean;
  achievedDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GoalResponse {
  success: boolean;
  data: Goal;
}

export interface GoalListResponse {
  success: boolean;
  count: number;
  data: Goal[];
}