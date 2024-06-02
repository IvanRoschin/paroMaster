import { IItem } from '@/types/item/IItem'

export interface NewOrderTemplateProps {
	name: string
	email: string
	phone: string
	cartItems: IItem[]
	totalAmount: number
	quantity: number[]
}

export function generateEmailContent({
	name,
	email,
	phone,
	cartItems,
	totalAmount,
	quantity,
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
      <h1>Замовлення з сайту ParoMaster</h1>
      <br />
      <br />
      <h3>
        <p>Від користувача ${name}</p>
        <p>Телефон ${phone}</p>
        <p>Вказаний e-mail: ${email}</p>
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
      <h2 style="text-align: center; color: #333;">Всього за замовленням: ${totalAmount} грн.</h2>

    </div>
  `
}
