export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
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
  username: string
  lastName: string
  email: string
  profilePicture?: string
  role?: string
}

