import { IOrder } from "@/types/index"

enum PaymentMethod {
  CashOnDelivery = "Оплата після отримання",
  CreditCard = "Оплата на карту",
  InvoiceForSPD = "Рахунок для СПД"
}

export function generateEmailContent(data: IOrder) {
  if (
    !data.number ||
    !data.customer.name ||
    !data.customer.email ||
    !data.customer.phone ||
    !data.customer.city ||
    !data.customer.warehouse ||
    !data.customer.payment ||
    !Array.isArray(data.orderedGoods) ||
    data.orderedGoods.length === 0 ||
    data.totalPrice <= 0
  ) {
    return { success: false, error: "Validation Error: Missing or invalid required data." }
  }
  const itemsContent = data.orderedGoods
    .map(
      ({ _id, title, brand, model, vendor, quantity, price }, index) => `
        <tr key="${_id}">
          <td>${index + 1}.</td>
          <td>${title}</td>
          <td style="text-align: center">${brand}</td>
          <td style="text-align: center">${model}</td>
					<td style="text-align: center">${vendor}</td>
          <td style="text-align: center">${quantity}</td>
          <td style="text-align: center">${price}</td>
        </tr>
      `
    )
    .join("")

  return `
    <div>
      <h1>Замовлення # ${data.number}
			з сайту ParoMaster</h1>
      <br />
      <br />
      <h3>
        <p>Від користувача: ${data.customer.name} ${data.customer.surname}</p>
        <p>Телефон:${data.customer.phone}</p>
        <p>Вказаний e-mail: ${data.customer.email}</p>
        <p>Вказаний спосіб оплати: ${data.customer.payment}</p>
        <p>Доставка за адресою:</p>
        <p>місто: ${data.customer.city}</p>
        <p>відділення НП: ${data.customer.warehouse}</p>
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
      <h2 style="text-align: center; color: #333;">Всього за замовленням: ${data.totalPrice} грн.</br>
      </h2>
    </div>
  `
}
