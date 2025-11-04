import { HydratedDocument } from 'mongoose';

import Token, { TokenType } from '@/models/Token';
import User, { IUserMethods } from '@/models/User';
import { IUser } from '@/types/index';
import { connectToDB } from '@/utils/dbConnect';
import crypto from 'crypto';
import { serializeDoc } from '../lib';
import { sendUserCredentialsEmail } from './sendNodeMailer';

// Генерация случайного пароля
function generateRandomPassword(length = 10) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

export async function verifyUser(tokenValue: string): Promise<{
  success: boolean;
  message: string;
  user?: IUser;
}> {
  try {
    if (!tokenValue) {
      return { success: false, message: 'Токен не передан' };
    }

    await connectToDB();

    // 1️⃣ Ищем токен
    const tokenDoc = await Token.findOne({
      token: tokenValue,
      type: TokenType.VERIFICATION,
      used: false,
    });

    if (!tokenDoc) {
      return { success: false, message: 'Неверный или использованный токен' };
    }

    // 2️⃣ Находим пользователя
    const user = (await User.findById(tokenDoc.userId)) as HydratedDocument<
      IUser,
      IUserMethods
    >;

    if (!user) {
      return { success: false, message: 'Пользователь не найден' };
    }

    if (user.isActive) {
      return { success: false, message: 'Пользователь уже активирован' };
    }

    // 3️⃣ Генерируем временный пароль
    const tempPassword = generateRandomPassword();
    user.setPassword(tempPassword);
    user.isActive = true;

    await user.save();

    // 4️⃣ Помечаем токен как использованный
    tokenDoc.used = true;
    await tokenDoc.save();

    // 5️⃣ Отправляем письмо с логином и паролем
    await sendUserCredentialsEmail({
      email: user.email!,
      name: user.name!,
      login: user.email!,
      password: tempPassword,
    });

    return {
      success: true,
      message:
        'Кабинет успешно активирован, данные для входа отправлены на email',
      user: serializeDoc<IUser>(user),
    };
  } catch (error: any) {
    console.error('verifyUser error:', error);
    return { success: false, message: error.message || 'Неизвестная ошибка' };
  }
}
