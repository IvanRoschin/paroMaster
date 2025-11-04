import crypto from 'crypto';

import { IOrder } from '@/types/index';

export function generateSignature(order: IOrder) {
  const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT!;
  const merchantDomainName = process.env.NWAYFORPAY_MERCHANT_DOMAIN!;
  const secretKey = process.env.WAYFORPAY_SECRET_KEY!;

  if (!secretKey) {
    throw new Error(
      'WAYFORPAY_SECRET_KEY is not defined in environment variables'
    );
  }

  function toUnixTimestamp(date?: Date | string): number {
    if (!date) return Math.floor(Date.now() / 1000);
    const parsed = new Date(date);
    return Math.floor(parsed.getTime() / 1000);
  }

  const orderDate = toUnixTimestamp(order.createdAt);

  // Собираем массивы продуктов
  const productNames = order.orderedGoods.map(item => item.good);
  const productCounts = order.orderedGoods.map(item =>
    (item.quantity ?? 1).toString()
  );
  const productPrices = order.orderedGoods.map(item => item.price.toFixed(2));

  // Собираем строку для подписи в нужном порядке
  const signatureString = [
    merchantAccount,
    merchantDomainName,
    order.number,
    orderDate,
    order.totalPrice.toFixed(2),
    'UAH',
    ...productNames,
    ...productCounts,
    ...productPrices,
  ].join(';');

  // Создаём HMAC-MD5 подпись
  const signature = crypto
    .createHmac('md5', secretKey)
    .update(signatureString)
    .digest('hex');

  return signature;
}
