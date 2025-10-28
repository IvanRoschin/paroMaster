'use server';

import {
  generateLidEmailContent,
  NewLidTemplateProps,
} from 'app/templates/email/NewLeadTemplate';
import { generateEmailContent } from 'app/templates/email/NewOrderTemplate';
import { FieldValues } from 'react-hook-form';

import { IOrder } from '@/types/index';
import sendgrid from '@sendgrid/mail';

if (
  !process.env.NEXT_PUBLIC_SENDGRID_API_KEY ||
  !process.env.NEXT_PUBLIC_ADMIN_EMAIL
) {
  throw new Error(
    'SENDGRID_API_KEY or ADMIN_EMAIL is not defined in the environment variables'
  );
}

sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);
const fromEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

function validateOrderData(data: IOrder) {
  // Используем customerSnapshot вместо customer
  const customer = data.customerSnapshot;

  if (
    !data.number ||
    !customer?.name ||
    !customer?.email ||
    !customer?.phone ||
    !customer?.city ||
    !customer?.warehouse ||
    !customer?.payment ||
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

  const customer = data.customerSnapshot;

  try {
    // Prepare email content
    const emailContent = generateEmailContent(data);

    if (typeof emailContent !== 'string') {
      console.error('Помилка генерації контенту листа:', emailContent.error);
      return { success: false, error: emailContent.error };
    }

    if (!fromEmail) {
      return {
        success: false,
        error: 'Configuration Error: Missing sender email address.',
      };
    }

    await sendgrid.send({
      from: fromEmail,
      to: fromEmail,
      subject: `Нове замовлення №${data.number} від ${customer.name}${customer.surname ? ` ${customer.surname}` : ''}`,
      text: `Замовлення №${data.number} від: ${customer.name}${customer.surname ? ` ${customer.surname}` : ''}, Телефон: ${customer.phone}, Email: ${customer.email}`,
      html: emailContent,
    });

    console.log('Admin email successfully sent.');
    return { success: true };
  } catch (error: any) {
    const errorMessage =
      error.response?.body?.errors?.[0]?.message ||
      error.message ||
      'Unknown error occurred.';
    console.error('Error sending admin email:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function sendCustomerEmail(data: IOrder) {
  const validation = validateOrderData(data);
  if (!validation.success) return validation;

  const customer = data.customerSnapshot;

  try {
    const emailContent = generateEmailContent(data);

    if (typeof emailContent !== 'string') {
      console.error('Помилка генерації контенту листа:', emailContent.error);
      return { success: false, error: emailContent.error };
    }

    if (!fromEmail || !customer.email) {
      return {
        success: false,
        error: 'Configuration Error: Missing sender or receiver email address.',
      };
    }

    await sendgrid.send({
      from: fromEmail,
      to: [customer.email],
      subject: `Ваше замовлення на сайті ParoMaster`,
      html: emailContent,
    });

    console.log('Customer Email sent successfully');
    return { success: true };
  } catch (error: any) {
    const errorMessage =
      error.response?.body?.errors?.[0]?.message ||
      error.message ||
      'Unknown error occurred.';
    console.error('Error sending customer email:', errorMessage);
    return {
      success: false,
      error: errorMessage,
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

    await sendgrid.send({
      from: fromEmail,
      to: fromEmail,
      subject: `Заповнена форма зв'язку на сайті від ${name}, контактний email: ${email}`,
      html: emailContent,
    });

    console.log('Lead email sent successfully');
    return { success: true };
  } catch (error: any) {
    const errorMessage =
      error.response?.body?.errors?.[0]?.message ||
      error.message ||
      'Unknown error occurred.';
    console.error('Error sending lid email:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
