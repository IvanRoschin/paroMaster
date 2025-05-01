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
          <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${index + 1}</td>
          <td style="padding: 8px; border: 1px solid #ccc;">${title}</td>
          <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${brand}</td>
          <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${model}</td>
          <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${vendor}</td>
          <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${quantity}</td>
          <td style="padding: 8px; border: 1px solid #ccc; text-align: center;">${price} грн</td>
        </tr>
      `
    )
    .join("")

  return `
    <div style="max-width: 800px; margin: 0 auto; padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fff; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2196F3;">🛒 НОВЕ ЗАМОВЛЕННЯ №${data.number}</h1>
        <p style="font-size: 18px; color: #666;">з сайту <strong>ParoMaster</strong></p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="margin-bottom: 10px;">👤 Клієнт:</h2>
        <p><strong>Ім'я:</strong> ${data.customer.name} ${data.customer.surname}</p>
        <p><strong>Телефон:</strong> ${data.customer.phone}</p>
        <p><strong>Email:</strong> ${data.customer.email}</p>
        <p><strong>Спосіб оплати:</strong> ${data.customer.payment}</p>
        <p><strong>Місто:</strong> ${data.customer.city}</p>
        <p><strong>Відділення НП:</strong> ${data.customer.warehouse}</p>
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
        <h2 style="color: #E91E63;">💰 Сума замовлення: ${data.totalPrice} грн</h2>
      </div>

      <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #999;">
        <p>Перевірте дані клієнта перед обробкою замовлення 📋</p>
        <p>Успішних продажів бажає ParoMaster 🚀</p>
      </div>
    </div>
  `
}
