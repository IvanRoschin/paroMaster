'use server';

import {
  generateLidEmailContent,
  NewLidTemplateProps,
} from 'app/templates/email/NewLidTemplate';
import { generateEmailContent } from 'app/templates/email/NewOrderTemplate';
import { FieldValues } from 'react-hook-form';

import { IOrder } from '@/types/index';

import { sendMail } from '../lib/sendMail';

const fromEmail = process.env.SMTP_EMAIL;

if (!fromEmail) {
  throw new Error('SMTP_EMAIL is not defined in the environment variables');
}

function validateOrderData(data: IOrder) {
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

  return { success: true };
}

export async function sendAdminEmail(data: IOrder) {
  const validation = validateOrderData(data);
  if (!validation.success) return validation;

  try {
    const emailContent = generateEmailContent(data);

    if (typeof emailContent !== 'string') {
      console.error('Помилка генерації контенту листа:', emailContent.error);
      return { success: false, error: emailContent.error };
    }

    await sendMail({
      to: fromEmail!,
      name: 'ParoMaster Admin',
      subject: `Нове замовлення №${data.number} від ${data.customer.name}${
        data.customer.surname ? ` ${data.customer.surname}` : ''
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

export async function sendCustomerEmail(data: IOrder) {
  const validation = validateOrderData(data);
  if (!validation.success) return validation;

  try {
    const emailContent = generateEmailContent(data);

    if (typeof emailContent !== 'string') {
      console.error('Помилка генерації контенту листа:', emailContent.error);
      return { success: false, error: emailContent.error };
    }

    if (!data.customer.email) {
      return { success: false, error: 'Missing recipient email address.' };
    }

    await sendMail({
      to: data.customer.email,
      name: data.customer.name,
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
    throw new Error('Error: not all data passed');
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
