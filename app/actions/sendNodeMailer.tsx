'use server';

import {
  generateLidEmailContent,
  NewLidTemplateProps,
} from 'app/templates/email/NewLeadTemplate';
import { generateEmailContent } from 'app/templates/email/NewOrderTemplate';
import { FieldValues } from 'react-hook-form';

import { IOrder } from '@/types/index';

import { sendMail } from '../lib/sendMail';

const fromEmail = process.env.SMTP_EMAIL;

if (!fromEmail) {
  throw new Error('SMTP_EMAIL is not defined in the environment variables');
}

export interface IOrderedGoodSnapshot {
  good: {
    _id: string;
    title: string;
    brand: string | null;
    model: string;
    sku: string;
  };
  quantity: number;
  price: number;
}

export interface IUserCredentials {
  email: string;
  name: string;
  login: string;
  password: string;
}

function validateOrderData(order: IOrder) {
  const customer = order.customerSnapshot;

  if (
    !order.number ||
    !customer?.user.name ||
    !customer?.user.email ||
    !customer?.user.phone ||
    !customer?.city ||
    !customer?.warehouse ||
    !customer?.payment ||
    !Array.isArray(order.orderedGoods) ||
    order.orderedGoods.length === 0 ||
    order.totalPrice <= 0
  ) {
    return {
      success: false,
      error: 'Validation Error: Missing or invalid required data.',
    };
  }

  return { success: true };
}

export async function sendUserCredentialsEmail({
  email,
  name,
  login,
  password,
}: IUserCredentials) {
  if (!email || !login || !password) {
    return {
      success: false,
      error: 'Validation Error: Missing required user credentials.',
    };
  }

  try {
    const emailContent = `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 10px; color: #333;">
        <h2>Привіт, ${name}!</h2>
        <p>Ваш обліковий запис створена на сайті магазину запчастин <strong>ParoMaster</strong>.</p>
        <p><strong>Логін:</strong> ${login}</p>
        <p><strong>Пароль:</strong> ${password}</p>
        <p>Радимо змінити пароль після першого входу.</p>
        <p>Бажаємо приємних покупок 🚀</p>
      </div>
    `;

    await sendMail({
      to: email,
      from: {
        email: 'no-reply@paromaster.com',
        name: 'Магазин запчастин ParoMaster',
      },
      name,
      subject: 'Ваші дані для входу на ParoMaster',
      body: emailContent,
    });

    console.log('✅ User credentials email successfully sent.');
    return { success: true };
  } catch (error: any) {
    console.error(
      '❌ Error sending user credentials email:',
      error.message || error
    );
    return {
      success: false,
      error: error.message || 'Unknown error occurred.',
    };
  }
}

export async function sendAdminEmail(
  order: IOrder,
  orderedGoodsSnapshot: IOrderedGoodSnapshot[]
) {
  const validation = validateOrderData(order);
  if (!validation.success) return validation;

  const customer = order.customerSnapshot;

  try {
    const emailContent = generateEmailContent(order, orderedGoodsSnapshot);

    if (typeof emailContent !== 'string') {
      console.error('Помилка генерації контенту листа:', emailContent.error);
      return { success: false, error: emailContent.error };
    }

    await sendMail({
      to: fromEmail!,
      from: {
        email: 'no-reply@paromaster.com',
        name: 'Магазин запчастин ParoMaster',
      },
      name: 'ParoMaster Admin',
      subject: `Нове замовлення №${order.number} від ${customer.user.name}${
        customer.user.surname ? ` ${customer.user.surname}` : ''
      }`,
      body: emailContent,
    });

    console.log('✅ Admin email successfully sent.');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error sending admin email:', error.message || error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred.',
    };
  }
}

export async function sendCustomerEmail(
  order: IOrder,
  orderedGoodsSnapshot: IOrderedGoodSnapshot[]
) {
  const validation = validateOrderData(order);
  if (!validation.success) return validation;

  const customer = order.customerSnapshot;

  try {
    const emailContent = generateEmailContent(order, orderedGoodsSnapshot);

    if (typeof emailContent !== 'string') {
      console.error('Помилка генерації контенту листа:', emailContent.error);
      return { success: false, error: emailContent.error };
    }

    if (!customer.user.email) {
      return { success: false, error: 'Missing recipient email address.' };
    }

    await sendMail({
      to: customer.user.email,
      from: {
        email: 'no-reply@paromaster.com',
        name: 'Магазин запчастин ParoMaster',
      },
      name: customer.user.name,
      subject: `Ваше замовлення на сайті ParoMaster`,
      body: emailContent,
    });

    console.log('✅ Customer email successfully sent.');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error sending customer email:', error.message || error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred.',
    };
  }
}

export async function sendEmailToLid(data: FieldValues) {
  const { email, name, phone } = data;

  if (!email || !name || !phone) {
    return {
      success: false,
      error: 'Error: not all data passed',
    };
  }

  try {
    const emailContent = generateLidEmailContent({
      email,
      name,
      phone,
    } as NewLidTemplateProps);

    await sendMail({
      to: fromEmail!,
      name,
      subject: `Заповнена форма зв'язку на сайті від ${name}, контактний email: ${email}`,
      body: emailContent,
    });

    console.log('✅ Lid email successfully sent.');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error sending lid email:', error.message || error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred.',
    };
  }
}
