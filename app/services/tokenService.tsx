'use server';

import crypto from 'crypto';

import Token, { TokenDocument, TokenType } from '@/models/Token';
import { connectToDB } from '@/utils/dbConnect';

export async function generateTokenString(len = 32) {
  return crypto.randomBytes(len).toString('hex');
}

export interface CreateTokenOpts {
  userId: string;
  type?: TokenType;
  email?: string;
  ttlSeconds?: number;
}

export async function createTokenService(opts: CreateTokenOpts) {
  await connectToDB();
  const { userId, type = TokenType.REFRESH, email, ttlSeconds } = opts;

  const defaultTTLs: Record<TokenType, number> = {
    [TokenType.REFRESH]: 60 * 60 * 24 * 30,
    [TokenType.VERIFICATION]: 60 * 60 * 24,
    [TokenType.PASSWORD_RESET]: 60 * 60 * 2,
    [TokenType.EMAIL_CHANGE]: 60 * 60,
  };

  const token = await generateTokenString();
  const expiresAt = new Date(
    Date.now() + 1000 * (ttlSeconds ?? defaultTTLs[type])
  );

  return Token.create({ userId, email, token, type, used: false, expiresAt });
}

export async function findValidTokenService(
  tokenValue: string,
  type?: TokenType
) {
  await connectToDB();
  const query: any = { token: tokenValue, used: false };
  if (type) query.type = type;

  const tokenDoc = await Token.findOne(query);
  if (!tokenDoc) return null;

  if (tokenDoc.expiresAt && tokenDoc.expiresAt < new Date()) {
    tokenDoc.used = true;
    await tokenDoc.save();
    return null;
  }

  return tokenDoc as TokenDocument;
}

export async function markTokenUsedService(tokenDoc: TokenDocument) {
  tokenDoc.used = true;
  await tokenDoc.save();
}

export async function revokeTokensForUserService(
  userId: string,
  type?: TokenType
) {
  await connectToDB();
  const q: any = { userId };
  if (type) q.type = type;
  await Token.updateMany(q, { used: true });
}
