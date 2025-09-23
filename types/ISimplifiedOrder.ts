export interface ISimplifiedOrder {
  number: string;
  totalPrice: number;
  customer: {
    name: string;
    surname: string;
    city: string;
    warehouse: string;
    email: string;
  };
  orderedGoods: {
    title: string;
    price: number;
    quantity: number;
  }[];
}
