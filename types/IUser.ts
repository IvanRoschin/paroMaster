export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
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
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
