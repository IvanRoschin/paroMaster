import { generateSignature } from "app/lib/orders"

import { getOrderById } from "@/actions/orders"
import { ErrorMessage, Loader } from "@/components/index"
import { useFetchDataById } from "@/hooks/index"

// app/order/[id]/pay/page.tsx

export default async function OrderPayPage({ params }: { params: { id: string } }) {
  const {
    data: order,
    isLoading,
    isError,
    error
  } = useFetchDataById(getOrderById, ["orderById"], params.id)

  if (isLoading || !order) {
    return <Loader />
  }

  if (isError) {
    return <ErrorMessage error={error} />
  }

  const signature = generateSignature(order)

  const orderDate = Math.floor(new Date(order.createdAt as string).getTime() / 1000)

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
      <form
        method="POST"
        action="https://secure.wayforpay.com/pay"
        acceptCharset="utf-8"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
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
        <input type="hidden" name="amount" value={order.totalPrice.toFixed(2)} />
        <input type="hidden" name="currency" value="UAH" />
        <input type="hidden" name="orderTimeout" value="49000" />
        <input type="hidden" name="defaultPaymentSystem" value="card" />

        {order.orderedGoods.map((item, index) => (
          <div key={index}>
            <input type="hidden" name="productName[]" value={item.title} />
            <input type="hidden" name="productPrice[]" value={item.price.toString()} />
            <input type="hidden" name="productCount[]" value={(item.quantity ?? 1).toString()} />
          </div>
        ))}

        <input type="hidden" name="clientFirstName" value={order.customer.name} />
        <input type="hidden" name="clientLastName" value={order.customer.surname} />
        <input type="hidden" name="clientEmail" value={order.customer.email} />
        <input type="hidden" name="clientCity" value={order.customer.city} />
        <input type="hidden" name="clientAddress" value={order.customer.warehouse} />
        <input type="hidden" name="merchantSignature" value={signature} />

        <button type="submit">Оплатити</button>
      </form>
    </div>
  )
}
