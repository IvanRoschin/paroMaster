import { IOrder } from '@/types/index';
import crypto from 'crypto';

export function generateSignature(order: IOrder) {
  const merchantAccount = process.env.NEXT_PUBLIC_WAYFORPAY_MERCHANT_ACCOUNT!;
  const merchantDomainName = process.env.NEXT_PUBLIC_WAYFORPAY_MERCHANT_DOMAIN!;
  const secretKey = process.env.WAYFORPAY_SECRET_KEY!;

  if (!secretKey) {
    throw new Error(
      'WAYFORPAY_SECRET_KEY is not defined in environment variables'
    );
  }

  const orderDate = Math.floor(
    new Date(order.createdAt as string).getTime() / 1000
  );

  // Собираем массивы продуктов
  const productNames = order.orderedGoods.map(item => item.title);
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
