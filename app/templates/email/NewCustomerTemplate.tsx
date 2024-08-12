import { IGood } from '@/types/good/IGood'

enum PaymentMethod {
	CashOnDelivery = 'Оплата після отримання',
	CreditCard = 'Оплата на карту',
	InvoiceForSPD = 'Рахунок для СПД',
}

export interface NewCustomerTemplateProps {
	name: string
	surname: string
	email: string
	phone: string
	payment: PaymentMethod
	city: string
	warehouse: string
	cartItems: IGood[]
	totalAmount: number
	quantity: number[]
	orderNumber: string
}

export function generateCustomerEmailContent({
	name,
	surname,
	email,
	phone,
	payment,
	city,
	warehouse,
	cartItems,
	totalAmount,
	quantity,
	orderNumber,
}: NewCustomerTemplateProps): string {
	const itemsContent = cartItems
		.map(
			(item, index) => `
        <tr key="${item._id}">
          <td>${index + 1}.</td>
          <td>${item.title}</td>
          <td style="text-align: center">${item.brand}</td>
          <td style="text-align: center">${item.model}</td>
					<td style="text-align: center">${item.vendor}</td>
          <td style="text-align: center">${quantity[index]}</td>
          <td style="text-align: center">${item.price}</td>
        </tr>
      `,
		)
		.join('')

	return `
    <div>
      <h1> Шановний ${name} ${surname} !
      <br />
      <br />
      <h3>
      <p> Ви оформили замовлення # ${orderNumber}
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
      
           <h2 style="text-align: center; color: #333;">Всього за замовленням: ${totalAmount} грн.</br> + доставка за тарифами перевізника
      </h2>
<h3>
        <p>Просимо перевірити наступну контактну інформацію, необхідну нам для найшвидчего оформлення замовлення:</p>
        <p>Номер телефону:${phone}</p>
        <p>Доставка за адресою:</p>
        <p>місто: ${city}</p>
        <p>відділення НП: ${warehouse}</p>
        <p>Обраний спосіб оплати: ${payment}</p>
      
      </h3>

      <h3>Щиро вдячний за довіру!
      <p>З повагою, власник сайту ParoMaster.</p>
      <p>${process.env.ADMIN_NAME}</p>
      <p>тел.: ${process.env.ADMIN_PHONE}</p>
      <p>email: ${process.env.ADMIN_EMAIL}</p>
      </h3>
    </div>
  `
}
