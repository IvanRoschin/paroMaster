import { IOrder } from "@/types/index"

enum PaymentMethod {
  CashOnDelivery = "Оплата після отримання",
  CreditCard = "Оплата на карту",
  InvoiceForSPD = "Рахунок для СПД"
}

export function generateCustomerEmailContent(data: IOrder) {
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
      <h1> Шановний ${data.customer.name} ${data.customer.surname} !
      <br />
      <br />
      <h3>
      <p> Ви оформили замовлення # ${data.number}
		на сайті ParoMaster</h1></p>
 </h3>
    <h2>
        <p>Ваше Замовлення:</p>
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
      <br />
      <br />
      
           <h2 style="text-align: center; color: #333;">Всього за замовленням: ${data.totalPrice} грн.</br> + доставка за тарифами перевізника
      </h2>
<h3>
        <p>Просимо перевірити наступну контактну інформацію, необхідну нам для найшвидчего оформлення замовлення:</p>
        <p>Номер телефону:${data.customer.phone}</p>
        <p>Доставка за адресою:</p>
        <p>місто: ${data.customer.city}</p>
        <p>відділення НП: ${data.customer.warehouse}</p>
        <p>Обраний спосіб оплати: ${data.customer.payment}</p>
      
      </h3>

      <h3>Щиро вдячний за довіру!
      <p>З повагою, власник сайту ParoMaster.</p>
      <p>${process.env.NEXT_PUBLIC_ADMIN_NAME}</p>
      <p>тел.: ${process.env.NEXT_PUBLIC_ADMIN_PHONE}</p>
      <p>email: ${process.env.NEXT_PUBLIC_ADMIN_EMAIL}</p>
      </h3>
    </div>
  `
}
