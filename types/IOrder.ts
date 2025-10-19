import { ICustomer, ICustomerSnapshot } from './ICustomer';
import { IGoodBase } from './IGood';
import { OrderStatus } from './orderStatus';

export interface IOrder {
  _id?: string;
  number: string;
  customer?: string | ICustomer;
  customerSnapshot: ICustomerSnapshot;
  orderedGoods: Array<{
    good: string | IGoodBase;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
