export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  GUEST = 'guest',
}

export interface IUser {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  token?: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  googleId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface SessionUser {
  id: string;
  name?: string | null;
  surname?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  warehouse?: string | null;
  payment?: string | null;
  role?: string | null;
  image?: string | null;
}
