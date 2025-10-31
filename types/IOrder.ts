import { PaymentMethod } from './paymentMethod';

export interface IOrderGood {
  good: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id?: string;
  number?: string;
  customer: string;
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
