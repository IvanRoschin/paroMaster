import { IOrder } from './IOrder';
import { IUser } from './IUser';
import { PaymentMethod } from './paymentMethod';

export interface ICustomer {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  city: string;
  warehouse: string;
  payment: PaymentMethod;
  orders?: string[] | IOrder[];
  user?: string | IUser;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICustomerSnapshot {
  name: string;
  surname: string;
  email: string;
  phone: string;
  city: string;
  warehouse: string;
  payment: string;
}
