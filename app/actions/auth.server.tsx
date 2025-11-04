'use server';

import crypto from 'crypto';

import { sendMail, serializeDoc } from '@/app/lib';
import Token, { TokenType } from '@/models/Token';
import User from '@/models/User';
import { IUser } from '@/types/IUser';
import { connectToDB } from '@/utils/dbConnect';

import type { IUserMethods } from '@/models/User';
import type { HydratedDocument } from 'mongoose';

function generateRandomPassword(length = 10) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

export async function verifyUser(tokenValue: string) {
  try {
    if (!tokenValue) return { success: false, message: 'Токен не передан' };
    await connectToDB();

    const tokenDoc = await Token.findOne({
      token: tokenValue,
      type: TokenType.VERIFICATION,
      used: false,
    });
    if (!tokenDoc)
      return { success: false, message: 'Неверный или использованный токен' };

    const user = (await User.findById(tokenDoc.userId)) as HydratedDocument<
      IUser,
      IUserMethods
    >;
    if (!user) return { success: false, message: 'Пользователь не найден' };
    if (user.isActive)
      return { success: false, message: 'Пользователь уже активирован' };

    const tempPassword = generateRandomPassword();
    user.setPassword(tempPassword);
    user.isActive = true;
    await user.save();

    tokenDoc.used = true;
    await tokenDoc.save();

    const resetPasswordUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/customer/profile/change-password`;

    const emailContent = `
      <div style="max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9;border-radius:10px;font-family:Arial,sans-serif;color:#333;">
        <h2>Привіт, ${user.name}!</h2>
        <p>Ваш кабінет активовано на <strong>ParoMaster</strong>.</p>
        <p><strong>Логін:</strong> ${user.email}</p>
        <p><strong>Пароль:</strong> ${tempPassword}</p>
        <p>Змініть пароль після першого входу:
          <a href="${resetPasswordUrl}" style="color:#2196F3;">змінити пароль</a>
        </p>
      </div>
    `;

    await sendMail({
      to: user.email!,
      subject: 'Ваші дані для входу на ParoMaster',
      body: emailContent,
    });

    return {
      success: true,
      message: 'Кабінет активовано. Дані для входу відправлено на email.',
      user: serializeDoc<IUser>(user),
    };
  } catch (error: any) {
    console.error('verifyUser error:', error);
    return { success: false, message: error.message || 'Неизвестная ошибка' };
  }
}
