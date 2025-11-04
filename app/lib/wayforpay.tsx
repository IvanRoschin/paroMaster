'use server';

import axios from 'axios';
import crypto from 'crypto';

import { IOrder } from '@/types/IOrder';

const account = process.env.WAYFORPAY_MERCHANT_ACCOUNT!;
const secret = process.env.WAYFORPAY_SECRET_KEY!;
const apiUrl = process.env.WAYFORPAY_URL!;
const baseUrl = process.env.PUBLIC_URL || 'https://paro-master.vercel.app';

if (!account || !secret || !apiUrl) {
  throw new Error('WayForPay config variables are missing');
}

function createSignature(str: string): string {
  return crypto.createHmac('md5', secret).update(str).digest('hex');
}

function createStringForSignature(arr: (string | number)[]): string {
  return arr.join(';');
}

function prepareFields(order: IOrder) {
  const { orderedGoods, customerSnapshot, totalPrice, number } = order;

  return {
    merchantAccount: account,
    merchantDomainName: 'paro-master',
    merchantTransactionSecureType: 'AUTO',
    orderReference: String(number),
    orderDate: Date.now(),
    amount: totalPrice,
    currency: 'UAH',
    productName: orderedGoods.map(good => String(good.good || '').trim()),
    productPrice: orderedGoods.map(good => String(good.price ?? '0')),
    productCount: orderedGoods.map(good => String(good.quantity ?? '1')),
    ...(customerSnapshot && { clientFirstName: customerSnapshot.user.name }),
    ...(customerSnapshot && { clientLastName: customerSnapshot.user.surname }),
    ...(customerSnapshot && { clientAddress: customerSnapshot.warehouse }),
    ...(customerSnapshot && { clientCity: customerSnapshot.city }),
    ...(customerSnapshot && { clientEmail: customerSnapshot.user.email }),
    defaultPaymentSystem: 'card',
    serviceUrl: `${baseUrl}/api/wayforpay-callback`,
  };
}

function prepareOrderRequest(preparedOrder: ReturnType<typeof prepareFields>) {
  const {
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    currency,
    productName,
    productPrice,
    productCount,
  } = preparedOrder;

  const toStrOrNum = (v: string | number | undefined): string | number =>
    v ?? '';

  const signatureString = createStringForSignature([
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    amount,
    currency,
    ...productName.map(toStrOrNum),
    ...productCount.map(toStrOrNum),
    ...productPrice.map(toStrOrNum),
  ]);

  const merchantSignature = createSignature(signatureString);

  return {
    ...preparedOrder,
    transactionType: 'CREATE_INVOICE',
    merchantAuthType: 'SimpleSignature',
    merchantSignature,
    apiVersion: 1,
    language: 'UA',
  };
}

export async function createWayForPayInvoice(order: IOrder) {
  const fields = prepareFields(order);
  const request = prepareOrderRequest(fields);

  try {
    const response = await axios.post(apiUrl, request, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (err: any) {
    console.error('WayForPay error:', err?.response?.data || err.message);
    throw new Error('Не вдалося створити платіж. Спробуйте пізніше.');
  }
}
