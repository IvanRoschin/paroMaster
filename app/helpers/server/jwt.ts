import jwt from 'jsonwebtoken';

import Token from '@/models/Token';

const ACCESS_TOKEN_EXPIRES = '15m'; // короткоживущий токен
const REFRESH_TOKEN_EXPIRES = '30d';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

// 1️⃣ Генерация пары токенов
export function generateTokens(payload: object) {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });
  return { accessToken, refreshToken };
}

// 2️⃣ Верификация токена
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// 3️⃣ Сохранение refresh-токена
export async function saveRefreshToken(userId: string, refreshToken: string) {
  await Token.findOneAndUpdate(
    { userId },
    { refreshToken },
    { upsert: true, new: true }
  );
}

// 4️⃣ Удаление refresh-токена (при выходе)
export async function removeRefreshToken(refreshToken: string) {
  await Token.findOneAndDelete({ refreshToken });
}

// 5️⃣ Обновление токенов
export async function refreshTokens(oldRefreshToken: string) {
  const payload = verifyToken(oldRefreshToken);
  if (!payload) throw new Error('Invalid refresh token');

  const tokenRecord = await Token.findOne({ refreshToken: oldRefreshToken });
  if (!tokenRecord) throw new Error('Refresh token not found');

  const newTokens = generateTokens({ id: tokenRecord.userId });
  await saveRefreshToken(tokenRecord.userId.toString(), newTokens.refreshToken);

  return newTokens;
}
