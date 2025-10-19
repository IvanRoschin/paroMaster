export interface IUser {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  password?: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
