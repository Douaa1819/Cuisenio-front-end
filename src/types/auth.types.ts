export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  role?: Role;
  password: string
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UserProfile {
  id?: number
  firstName: string
  lastName: string
  email: string
  profilePicture?: string
  role?: string
}

