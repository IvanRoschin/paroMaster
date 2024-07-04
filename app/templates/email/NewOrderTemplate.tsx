import { IGood } from '@/types/good/IGood'

enum PaymentMethod {
	CashOnDelivery = 'Оплата після отримання',
	CreditCard = 'Оплата на карту',
	InvoiceForSPD = 'Рахунок для СПД',
}

export interface NewOrderTemplateProps {
	name: string
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

// const date = new Date()
// const year = date.getFullYear().toString()
// const month = (date.getMonth() + 1).toString().padStart(2, '0')
// const day = date
// 	.getDate()
// 	.toString()
// 	.padStart(2, '0')
// const formattedDate = `${day}${month}${year}`

// const index = 1 // Your index value

export function generateEmailContent({
	name,
	email,
	phone,
	payment,
	city,
	warehouse,
	cartItems,
	totalAmount,
	quantity,
	orderNumber,
}: NewOrderTemplateProps): string {
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
      <h1>Замовлення # ${orderNumber}
			з сайту ParoMaster</h1>
      <br />
      <br />
      <h3>
        <p>Від користувача: ${name}</p>
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
      <h2 style="text-align: center; color: #333;">Всього за замовленням: ${totalAmount} грн.</br> + доставка за тарифами перевізника
      </h2>

    </div>
  `
}
