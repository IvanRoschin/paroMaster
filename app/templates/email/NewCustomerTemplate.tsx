import { IOrderedGoodSnapshot } from '@/app/services/sendNodeMailer';
import { IOrder } from '@/types/index';

export function generateCustomerEmailContent(
  order: IOrder,
  orderedGoodsSnapshot: IOrderedGoodSnapshot[]
) {
  const { number, customerSnapshot, orderedGoods, totalPrice } = order;

  if (
    !number ||
    !customerSnapshot.user.name ||
    !customerSnapshot.user.surname ||
    !customerSnapshot.user.phone ||
    !customerSnapshot.city ||
    !customerSnapshot.warehouse ||
    !customerSnapshot.payment ||
    !Array.isArray(orderedGoods) ||
    orderedGoods.length === 0 ||
    totalPrice <= 0
  ) {
    return {
      success: false,
      error: 'Validation Error: Missing or invalid required data.',
    };
  }

  const itemsContent = orderedGoodsSnapshot
    .map(({ good, quantity, price }, i) => {
      const item =
        typeof good === 'object' && good !== null
          ? good
          : { title: 'Невідомий товар', brand: '-', model: '-', sku: '-' };

      return `
        <tr key="${i}">
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${i + 1}</td>
          <td style="padding:8px;border:1px solid #ddd;">${item.title}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.model || '-'}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.model || '-'}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${item.sku || '-'}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${quantity}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center;">${price} грн</td>
        </tr>`;
    })
    .join('');

  return `
    <div style="max-width:700px;margin:0 auto;padding:30px;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:#333;background-color:#f9f9f9;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      <div style="text-align:center;">
        <h1 style="color:#4CAF50;">Вітаємо, ${customerSnapshot.user.name} ${customerSnapshot.user.surname}! 🎉</h1>
        <p style="font-size:18px;">Ваше замовлення №<strong>${number}</strong> прийнято!</p>
        <p style="font-size:16px;color:#666;">Дякуємо, що обрали ParoMaster. 🚀</p>
      </div>

      <h2 style="margin-top:40px;color:#333;">🛒 Деталі замовлення:</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:20px;">
        <thead style="background-color:#eee;">
          <tr>
            <th>#</th>
            <th>Назва</th>
            <th>Бренд</th>
            <th>Модель</th>
            <th>Артикул</th>
            <th>Кількість</th>
            <th>Ціна</th>
          </tr>
        </thead>
        <tbody>${itemsContent}</tbody>
      </table>

      <h2 style="margin-top:30px;text-align:center;color:#E91E63;">Разом до сплати: ${totalPrice} грн</h2>
      <p style="text-align:center;color:#666;">(Доставка сплачується окремо за тарифами перевізника)</p>

      <div style="margin-top:40px;">
        <h3>📍 Ваші контактні дані:</h3>
        <ul style="list-style-type:none;padding-left:0;">
          <li><strong>Телефон:</strong> ${customerSnapshot.user.phone}</li>
          <li><strong>Місто:</strong> ${customerSnapshot.city}</li>
          <li><strong>Відділення НП:</strong> ${customerSnapshot.warehouse}</li>
          <li><strong>Оплата:</strong> ${customerSnapshot.payment}</li>
        </ul>
      </div>

      <div style="margin-top:50px;text-align:center;">
        <p style="font-size:16px;color:#555;">❗ Якщо потрібно щось змінити — зв'яжіться з нами!</p>
        <p style="margin-top:30px;">Дякуємо за довіру ❤️</p>
        <p style="font-weight:bold;">Ваш ParoMaster Team</p>
        <p>📞 ${process.env.NEXT_PUBLIC_ADMIN_PHONE}</p>
        <p>📧 ${process.env.NEXT_PUBLIC_ADMIN_EMAIL}</p>
      </div>
    </div>`;
}
