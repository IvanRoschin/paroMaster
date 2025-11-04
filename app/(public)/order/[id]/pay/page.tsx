import { getOrderById } from '@/actions/orders';
import { generateSignature } from '@/app/lib';
import { ISearchParams } from '@/types/searchParams';

export const dynamic = 'force-dynamic'; // чтобы не кэшировалось

export default async function OrderPayPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;

  const order = await getOrderById(params.id);

  if (!order) return <div>Замовлення не знайдено</div>;

  const signature = generateSignature(order);
  const orderDate = Math.floor(
    new Date(order.createdAt ?? Date.now()).getTime() / 1000
  );

  return (
    <div className="flex justify-center mt-24">
      <form
        method="POST"
        action="https://secure.wayforpay.com/pay"
        acceptCharset="utf-8"
        className="flex flex-col gap-2"
      >
        <input
          type="hidden"
          name="merchantAccount"
          value={process.env.NEXT_PUBLIC_WAYFORPAY_MERCHANT_ACCOUNT!}
        />
        <input type="hidden" name="merchantAuthType" value="SimpleSignature" />
        <input
          type="hidden"
          name="merchantDomainName"
          value={process.env.NEXT_PUBLIC_WAYFORPAY_MERCHANT_DOMAIN!}
        />
        <input type="hidden" name="orderReference" value={order.number} />
        <input type="hidden" name="orderDate" value={orderDate.toString()} />
        <input
          type="hidden"
          name="amount"
          value={order.totalPrice.toFixed(2)}
        />
        <input type="hidden" name="currency" value="UAH" />
        <input type="hidden" name="orderTimeout" value="49000" />
        <input type="hidden" name="defaultPaymentSystem" value="card" />

        {order.orderedGoods.map((item: any, index: number) => (
          <div key={index}>
            <input type="hidden" name="productName[]" value={item.title} />
            <input
              type="hidden"
              name="productPrice[]"
              value={item.price.toString()}
            />
            <input
              type="hidden"
              name="productCount[]"
              value={(item.quantity ?? 1).toString()}
            />
          </div>
        ))}

        <input
          type="hidden"
          name="clientFirstName"
          value={order.customerSnapshot.user.name}
        />
        <input
          type="hidden"
          name="clientLastName"
          value={order.customerSnapshot.user.surname}
        />
        <input
          type="hidden"
          name="clientEmail"
          value={order.customerSnapshot.user.email}
        />
        <input
          type="hidden"
          name="clientCity"
          value={order.customerSnapshot.city}
        />
        <input
          type="hidden"
          name="clientAddress"
          value={order.customerSnapshot.warehouse}
        />
        <input type="hidden" name="merchantSignature" value={signature} />

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Оплатити
        </button>
      </form>
    </div>
  );
}
