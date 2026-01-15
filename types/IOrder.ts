import { Types } from 'mongoose';

import { PaymentMethod } from './paymentMethod';

export interface IOrderGood {
  good:
    | string
    | {
        _id: string;
        title: string;
        price?: number;
        discountPrice?: number;
        src?: string[];
      };
  quantity: number;
  price: number;
}

export interface ICustomerSnapshot {
  user: {
    name: string;
    surname: string;
    phone: string;
    email?: string;
  };
  city: string;
  warehouse: string;
  payment: PaymentMethod;
}

export interface IOrder {
  _id?: string;
  number?: string;
  customer: string | Types.ObjectId;
  customerSnapshot: ICustomerSnapshot;
  orderedGoods: IOrderGood[];
  totalPrice: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
