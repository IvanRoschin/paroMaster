'use server';

import nodemailer from 'nodemailer';

interface SendMailOptions {
  to: string;
  from?: { name: string; email: string };
  name?: string;
  subject: string;
  body: string;
}

export async function sendMail({
  to,
  from,
  name,
  subject,
  body,
}: SendMailOptions) {
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

  // Проверка соединения (опционально)
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
