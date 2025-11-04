'use server';

import {
  generateLidEmailContent,
  NewLidTemplateProps,
} from 'app/templates/email/NewLeadTemplate';
import { generateEmailContent } from 'app/templates/email/NewOrderTemplate';
import nodemailer from 'nodemailer';
import { FieldValues } from 'react-hook-form';

import { baseUrl, routes } from '@/helpers/routes';
import { TokenType } from '@/models/Token';
import { IOrder } from '@/types/index';

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

export interface IUserVerificationCredentials {
  email: string;
  name: string;
  token: TokenType;
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

// Универсальная функция отправки письма
export async function sendMail({
  to,
  from,
  name,
  subject,
  body,
}: {
  to: string;
  from?: { name: string; email: string };
  name?: string;
  subject: string;
  body: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  if (!SMTP_EMAIL || !SMTP_PASSWORD) {
    throw new Error(
      '❌ SMTP_EMAIL and SMTP_PASSWORD must be set in environment variables'
    );
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
  } catch (err) {
    console.error('❌ SMTP connection failed:', err);
  }

  const fromField =
    from?.email && from?.name
      ? { name: from.name, address: from.email }
      : `"ParoMaster" <${SMTP_EMAIL}>`;

  const result = await transporter.sendMail({
    from: fromField,
    to,
    name,
    subject,
    html: body,
  });

  console.log('✅ Email sent:', result.messageId);
  return result;
}

// Отправка письма для верификации пользователя
export async function sendVerificationLetter({
  email,
  name,
  token,
}: IUserVerificationCredentials) {
  if (!email || !name || !token) {
    return {
      success: false,
      error: 'sendVerificationLetter Error: Missing required user credentials.',
    };
  }

  const verificationUrl = `${baseUrl}${routes.publicRoutes.auth.verifyEmail}?token=${encodeURIComponent(token)}`;

  const emailContent = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 10px; color: #333;">
      <h2>Привіт, ${name}!</h2>
      <p>Ви зробили замовлення на сайті магазину запчастин <strong>ParoMaster</strong>.</p>
      <p>Щоб активувати особистий кабінет та отримувати спеціальні пропозиції, перейдіть за посиланням:</p>
      <p><strong><a href="${verificationUrl}" style="color: #2196F3; text-decoration: none;">Підтвердити реєстрацію</a></strong></p>
      <p>Бажаємо приємних покупок 🚀</p>
    </div>
  `;

  try {
    await sendMail({
      to: email,
      from: {
        email: 'no-reply@paromaster.com',
        name: 'Магазин запчастин ParoMaster',
      },
      subject: 'Підтвердження реєстрації на ParoMaster',
      body: emailContent,
    });

    console.log('✅ Verification letter successfully sent.');
    return { success: true };
  } catch (error: any) {
    console.error(
      '❌ Error sending verification email:',
      error.message || error
    );
    return {
      success: false,
      error: error.message || 'Unknown error occurred.',
    };
  }
}

// Отправка письма с данными пользователя
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

  const resetPasswordUrl = `${baseUrl}${routes.customerRoutes.changePassword}`;
  const emailContent = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 10px; color: #333;">
      <h2>Привіт, ${name}!</h2>
      <p>Ваш особистий кабінет активовано на сайті магазину запчастин <strong>ParoMaster</strong>.</p>
      <p><strong>Логін:</strong> ${login}</p>
      <p><strong>Пароль:</strong> ${password}</p>
      <p>Радимо змінити пароль після першого входу або за посиланням 
      <a href="${resetPasswordUrl}" style="color: #2196F3; text-decoration: none;">змінити пароль</a></p>
      <p>Бажаємо приємних покупок 🚀</p>
    </div>
  `;

  try {
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

// Отправка письма для администратора
export async function sendAdminEmail(
  order: IOrder,
  orderedGoodsSnapshot: IOrderedGoodSnapshot[]
) {
  const validation = validateOrderData(order);
  if (!validation.success) return validation;

  const customer = order.customerSnapshot;
  const fromEmail = process.env.SMTP_EMAIL!;
  const emailContent = generateEmailContent(order, orderedGoodsSnapshot);

  if (typeof emailContent !== 'string') {
    return { success: false, error: emailContent.error };
  }

  try {
    await sendMail({
      to: fromEmail,
      from: { email: 'no-reply@paromaster.com', name: 'ParoMaster Admin' },
      name: 'ParoMaster Admin',
      subject: `Нове замовлення №${order.number} від ${customer.user.name}`,
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

// Отправка письма клиенту
export async function sendCustomerEmail(
  order: IOrder,
  orderedGoodsSnapshot: IOrderedGoodSnapshot[]
) {
  const validation = validateOrderData(order);
  if (!validation.success) return validation;

  const customer = order.customerSnapshot;
  if (!customer.user.email)
    return { success: false, error: 'Missing recipient email address.' };

  const emailContent = generateEmailContent(order, orderedGoodsSnapshot);
  if (typeof emailContent !== 'string')
    return { success: false, error: emailContent.error };

  try {
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

// Отправка письма с лидом
export async function sendEmailToLid(data: FieldValues) {
  const { email, name, phone } = data;
  if (!email || !name || !phone)
    return { success: false, error: 'Error: not all data passed' };

  const emailContent = generateLidEmailContent({
    email,
    name,
    phone,
  } as NewLidTemplateProps);

  try {
    await sendMail({
      to: process.env.SMTP_EMAIL!,
      name,
      subject: `Заповнена форма зв'язку на сайті від ${name}, контактний email: ${email}`,
      body: emailContent,
    });

    console.log('✅ Lead email successfully sent.');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error sending lead email:', error.message || error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred.',
    };
  }
}
