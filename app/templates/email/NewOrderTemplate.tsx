import { CartItem } from "@/types/cart/ICartItem"

enum PaymentMethod {
  CashOnDelivery = "Оплата після отримання",
  CreditCard = "Оплата на карту",
  InvoiceForSPD = "Рахунок для СПД"
}

export interface NewOrderTemplateProps {
  name: string
  surname: string
  email: string
  phone: string
  payment: PaymentMethod
  city: string
  warehouse: string
  orderedGoods: CartItem[]
  orderNumber: string
  totalPrice: number
}

export function generateEmailContent({
  name,
  surname,
  email,
  phone,
  payment,
  city,
  warehouse,
  orderedGoods,
  orderNumber,
  totalPrice
}: NewOrderTemplateProps): string {
  const itemsContent = orderedGoods
    .map(
      ({ good, quantity }, index) => `
        <tr key="${good._id}">
          <td>${index + 1}.</td>
          <td>${good.title}</td>
          <td style="text-align: center">${good.brand}</td>
          <td style="text-align: center">${good.model}</td>
					<td style="text-align: center">${good.vendor}</td>
          <td style="text-align: center">${quantity}</td>
          <td style="text-align: center">${good.price}</td>
        </tr>
      `
    )
    .join("")

  return `
    <div>
      <h1>Замовлення # ${orderNumber}
			з сайту ParoMaster</h1>
      <br />
      <br />
      <h3>
        <p>Від користувача: ${name} ${surname}</p>
        <p>Телефон:${phone}</p>
        <p>Вказаний e-mail: ${email}</p>
        <p>Вказаний спосіб оплати: ${payment}</p>
        <p>Доставка за адресою:</p>
        <p>місто: ${city}</p>
        <p>відділення НП: ${warehouse}</p>
      </h3>
      <br />
      <br />
      <h2>
        <p>Замовлення:</p>
      </h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Назва</th>
            <th>Виробник</th>
            <th>Модель</th>
					  <th>Артикул</th>
            <th>Кількість</th>
            <th>Ціна</th>
          </tr>
        </thead>
        <tbody>
          ${itemsContent}
        </tbody>
      </table>
      <h2 style="text-align: center; color: #333;">Всього за замовленням: ${totalPrice} грн.</br>
      </h2>
    </div>
  `
}
