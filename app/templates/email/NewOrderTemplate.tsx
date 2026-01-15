import { IOrderedGoodSnapshot } from '@/app/services/sendNodeMailer';
import { paymentMethods } from '@/config/constants';
import { IOrder } from '@/types/index';

export function generateEmailContent(
  order: IOrder,
  orderedGoodsSnapshot: IOrderedGoodSnapshot[]
) {
  const { number, customerSnapshot, orderedGoods, totalPrice } = order;

  const customer = order.customerSnapshot;

  const paymentLabel =
    paymentMethods.find(pm => pm.id === customerSnapshot.payment)?.label ??
    'Невідомий спосіб оплати';

  if (
    !number ||
    !customer.user.name ||
    !customer.user.email ||
    !customer.user.phone ||
    !customer.city ||
    !customer.warehouse ||
    !customer.payment ||
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
          <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${i + 1}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${item.title}</td>
          <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${item.model}</td>
          <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${item.model}</td>
          <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${item.sku}</td>
          <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${quantity}</td>
          <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${price} грн</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div style="max-width: 800px; margin: 0 auto; padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fff; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2196F3;">🛒 НОВЕ ЗАМОВЛЕННЯ №${number}</h1>
        <p style="font-size: 18px; color: #666;">з сайту <strong>ParoMaster</strong></p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="margin-bottom: 10px;">👤 Клієнт:</h2>
        <p><strong>Ім'я:</strong> ${customerSnapshot.user.name} ${customerSnapshot.user.surname}</p>
        <p><strong>Телефон:</strong> ${customerSnapshot.user.phone}</p>
        <p><strong>Email:</strong> ${customerSnapshot.user.email}</p>
        <p><strong>Спосіб оплати:</strong> ${paymentLabel}</p>
        <p><strong>Місто:</strong> ${customerSnapshot.city}</p>
        <p><strong>Відділення НП:</strong> ${customerSnapshot.warehouse}</p>
      </div>

      <h2 style="margin-bottom: 10px;">📦 Список товарів:</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead style="background-color: #eeeeee;">
          <tr>
            <th style="padding: 10px; border: 1px solid #ccc;">#</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Назва</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Бренд</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Модель</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Артикул</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Кількість</th>
            <th style="padding: 10px; border: 1px solid #ccc;">Ціна</th>
          </tr>
        </thead>
        <tbody>
          ${itemsContent}
        </tbody>
      </table>

      <div style="margin-top: 30px; text-align: center;">
        <h2 style="color: #E91E63;">💰 Сума замовлення: ${totalPrice} грн</h2>
      </div>

      <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #999;">
        <p>Перевірте дані клієнта перед обробкою замовлення 📋</p>
        <p>Успішних продажів бажає ParoMaster 🚀</p>
      </div>
    </div>
  `;
}
