import nodemailer from 'nodemailer';

const { SMTP_PASSWORD, SMTP_EMAIL } = process.env;

if (!SMTP_EMAIL || !SMTP_PASSWORD) {
  throw new Error(
    'SMTP_EMAIL and SMTP_PASSWORD must be set in environment variables'
  );
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});

// Проверяем соединение один раз при старте
transporter
  .verify()
  .then(() => console.log('✅ SMTP connection verified'))
  .catch(err => console.error('❌ SMTP connection failed:', err));

export async function sendMail({
  to,
  from,
  name,
  subject,
  body,
}: {
  to: string;
  from?: { name: string; email: string };
  name: string;
  subject: string;
  body: string;
}) {
  try {
    const fromField =
      from?.email && from?.name
        ? { name: from.name, address: from.email }
        : `"ParoMaster" <${SMTP_EMAIL}>`;

    const result = await transporter.sendMail({
      from: fromField,
      to,
      subject,
      html: body,
    });

    console.log('✅ Email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
}
