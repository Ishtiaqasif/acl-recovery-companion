export interface UserProfile {
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'admin';
  surgeryDate?: Date;
  userProfile?: UserProfile;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  surgeryDate?: Date;
  userProfile?: UserProfile;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  surgeryDate?: Date;
  userProfile?: UserProfile;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}