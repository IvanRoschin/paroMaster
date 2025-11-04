import { Types } from 'mongoose';

import { PaymentMethod } from './paymentMethod';

export interface IOrderGood {
  good: string | Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id?: string;
  number?: string;
  customer: string | Types.ObjectId;
  customerSnapshot: {
    user: {
      name: string;
      surname: string;
      phone: string;
      email?: string;
    };
    city: string;
    warehouse: string;
    payment: PaymentMethod;
  };
  orderedGoods: IOrderGood[];
  totalPrice: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
