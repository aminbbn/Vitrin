export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED'
}

export enum AuthProvider {
  PASSWORD = 'PASSWORD',
  OTP = 'OTP',
  GOOGLE = 'GOOGLE'
}

export interface User {
  id: string; // UUID-like string
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  status: UserStatus;
  createdAt: string;
}

export interface AppSession {
  id: string;
  userId: string;
  user: User;
  token: string;
  expiresAt: string;
}

export interface UserSession {
  userId: string;
  email: string;
  fullName: string;
  isAdmin: boolean; // authenticated administrator state
}
