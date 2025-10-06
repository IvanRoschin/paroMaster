import { IOrder } from '@/types/index';

enum PaymentMethod {
  CashOnDelivery = 'Оплата після отримання',
  CreditCard = 'Оплата на карту',
  InvoiceForSPD = 'Рахунок для СПД',
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
    return {
      success: false,
      error: 'Validation Error: Missing or invalid required data.',
    };
  }

  const itemsContent = data.orderedGoods
    .map(
      ({ _id, title, brand, model, sku, quantity, price }, index) => `
        <tr key="${_id}">
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${index + 1}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${title}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${brand}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${model}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${sku}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${price} грн</td>
        </tr>
      `
    )
    .join('');

  return `
    <div style="max-width: 700px; margin: 0 auto; padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center;">
        <h1 style="color: #4CAF50;">Вітаємо, ${data.customer.name} ${data.customer.surname}! 🎉</h1>
        <p style="font-size: 18px;">Ваше замовлення №<strong>${data.number}</strong> прийнято!</p>
        <p style="font-size: 16px; color: #666;">Дякуємо, що обрали ParoMaster. Готуємо для вас тільки найкраще! 🚀</p>
      </div>

      <h2 style="margin-top: 40px; color: #333;">🛒 Деталі замовлення:</h2>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead style="background-color: #eeeeee;">
          <tr>
            <th style="padding: 10px; border: 1px solid #ddd;">#</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Назва</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Бренд</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Модель</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Артикул</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Кількість</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Ціна</th>
          </tr>
        </thead>
        <tbody>
          ${itemsContent}
        </tbody>
      </table>

      <h2 style="margin-top: 30px; text-align: center; color: #E91E63;">Разом до сплати: ${data.totalPrice} грн</h2>
      <p style="text-align: center; color: #666;">(Доставка сплачується окремо за тарифами перевізника)</p>

      <div style="margin-top: 40px;">
        <h3 style="color: #333;">📍 Ваші контактні дані:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li style="margin-bottom: 5px;"><strong>Телефон:</strong> ${data.customer.phone}</li>
          <li style="margin-bottom: 5px;"><strong>Місто:</strong> ${data.customer.city}</li>
          <li style="margin-bottom: 5px;"><strong>Відділення НП:</strong> ${data.customer.warehouse}</li>
          <li style="margin-bottom: 5px;"><strong>Оплата:</strong> ${data.customer.payment}</li>
        </ul>
      </div>

      <div style="margin-top: 50px; text-align: center;">
        <p style="font-size: 16px; color: #555;">❗ Якщо потрібно щось змінити — негайно зв'яжіться з нами!</p>
        <p style="margin-top: 30px;">Дякуємо за довіру ❤️</p>
        <p style="margin-top: 10px; font-weight: bold;">Ваш ParoMaster Team</p>
        <p>📞 ${process.env.NEXT_PUBLIC_ADMIN_PHONE}</p>
        <p>📧 ${process.env.NEXT_PUBLIC_ADMIN_EMAIL}</p>
      </div>
    </div>
  `;
}
