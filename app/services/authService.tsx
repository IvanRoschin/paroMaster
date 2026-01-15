'use server';

import crypto from 'crypto';

import { routes } from '@/app/helpers/routes';
import { generateRandomPassword, sendMail, serializeDoc } from '@/app/lib';
import Token, { TokenType } from '@/models/Token';
import User from '@/models/User';
import { IUser } from '@/types/IUser';
import { connectToDB } from '@/utils/dbConnect';

import {
  createTokenService,
  findValidTokenService,
  markTokenUsedService,
} from './tokenService';

// export function generateRandomPassword(length = 10) {
//   return crypto.randomBytes(length).toString('base64').slice(0, length);
// }

// ===== Верификация пользователя =====
export async function verifyUserService(tokenValue: string) {
  await connectToDB();
  const tokenDoc = await findValidTokenService(tokenValue);
  if (!tokenDoc)
    return { success: false, message: 'Невірний або прострочений токен' };

  const user = await User.findById(tokenDoc.userId);
  if (!user) return { success: false, message: 'Користувача не знайдено' };

  if (tokenDoc.type === TokenType.EMAIL_CHANGE) {
    if (!tokenDoc.email)
      return { success: false, message: 'Email не знайдено в токені' };
    user.email = tokenDoc.email;
    await user.save();
    await markTokenUsedService(tokenDoc);
    return {
      success: true,
      message: 'Email змінено',
      user: serializeDoc<IUser>(user),
    };
  }

  if (tokenDoc.type === TokenType.VERIFICATION) {
    if (user.isActive)
      return { success: false, message: 'Обліковий запис вже активовано' };

    const tempPassword = generateRandomPassword();
    user.setPassword(tempPassword);
    user.isActive = true;
    await user.save();
    await markTokenUsedService(tokenDoc);

    const emailContent = `
      <div>
        Привіт, ${user.name}!<br>
        Ваш обліковий запис активовано.<br>
        Логін: ${user.email}<br>
        Пароль: ${tempPassword}
      </div>
    `;
    await sendMail({
      to: user.email!,
      from: { email: 'no-reply@paromaster.com', name: 'ParoMaster' },
      subject: 'Ваші дані для входу',
      body: emailContent,
    });

    return {
      success: true,
      message: 'Аккаунт активовано',
      user: serializeDoc<IUser>(user),
    };
  }

  return { success: false, message: 'Невідомий тип токена' };
}

// ===== Сброс пароля =====
export async function sendPasswordResetEmailService(email: string) {
  await connectToDB();
  const user = await User.findOne({ email });
  if (!user)
    return {
      success: true,
      message: 'Якщо користувач існує — на email надіслано посилання',
    };

  // Удаляем старые токены
  await Token.deleteMany({ userId: user._id, type: TokenType.PASSWORD_RESET });

  const rawToken = crypto.randomUUID();
  const hashedToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex');

  await createTokenService({
    userId: user._id.toString(),
    type: TokenType.PASSWORD_RESET,
    ttlSeconds: 3600,
    email,
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_PUBLIC_URL}${routes.publicRoutes.auth.restorePassword}?token=${rawToken}`;

  await sendMail({
    to: user.email!,
    from: { email: 'no-reply@paromaster.com', name: 'ParoMaster' },
    subject: 'Сброс пароля',
    body: `<div>Щоб змінити пароль, перейдіть за посиланням: <a href="${resetUrl}">${resetUrl}</a></div>`,
  });

  return {
    success: true,
    message: 'Посилання для відновлення пароля надіслано',
  };
}

export async function resetPasswordService(
  token: string,
  password: string,
  confirmPassword: string
) {
  if (password !== confirmPassword)
    return { success: false, message: 'Паролі не співпадають' };

  await connectToDB();
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const tokenDoc = await findValidTokenService(
    hashedToken,
    TokenType.PASSWORD_RESET
  );
  if (!tokenDoc)
    return { success: false, message: 'Невірний або прострочений токен' };

  const user = await User.findById(tokenDoc.userId);
  if (!user) return { success: false, message: 'Користувача не знайдено' };

  user.setPassword(password);
  await user.save();
  await markTokenUsedService(tokenDoc);

  return { success: true, message: 'Пароль успішно змінено' };
}

// ===== Смена пароля =====
export async function changePasswordService(
  userId: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) {
  if (newPassword !== confirmPassword) {
    return { success: false, message: 'Паролі не співпадають' };
  }

  await connectToDB();

  if (!userId) {
    return { success: false, message: 'Необхідно увійти в акаунт' };
  }

  const user = await User.findById(userId);

  if (!user) {
    return { success: false, message: 'Користувача не знайдено' };
  }

  // ✔ Используем метод модели
  const isMatch = user.comparePassword(oldPassword);
  if (!isMatch) {
    return { success: false, message: 'Неправильний поточний пароль' };
  }

  // ✔ Меняем пароль через метод модели
  user.setPassword(newPassword);
  await user.save();

  return { success: true, message: 'Пароль успішно змінено' };
}
