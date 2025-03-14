export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface RegisterRequest {
  username: string;
  lastName: string;
  email: string;
  password: string;
  role?: Role;
}  

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  username: string;
  lastName: string;
  email: string;
  role: Role;
  registrationDate: string;
  blocked: boolean;
  profilePicture?: string; 
}

export interface UpdateProfileRequest {
  username?: string;
  lastName?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}