// import { HydratedDocument } from 'mongoose';

// import crypto from 'crypto';
// import Token, { IToken, TokenType } from '@/models/Token';
// import { connectToDB } from '../utils/dbConnect';

// // == tokenService.ts ==

// export type TokenDocument = HydratedDocument<IToken>;

// export interface CreateTokenOpts {
//   userId: string;
//   type?: TokenType;
//   email?: string; // for EMAIL_CHANGE
//   ttlSeconds?: number; // optional explicit ttl
// }

// export async function generateTokenString(len = 48) {
//   // base64url-like token
//   return crypto.randomBytes(len).toString('hex');
// }

// export async function createToken(opts: CreateTokenOpts) {
//   await connectToDB();
//   const { userId, type = TokenType.REFRESH, email, ttlSeconds } = opts;

//   // default TTL per type (seconds)
//   const defaultTTLs: Record<TokenType, number> = {
//     [TokenType.REFRESH]: 60 * 60 * 24 * 30, // 30 days
//     [TokenType.VERIFICATION]: 60 * 60 * 24, // 1 day
//     [TokenType.PASSWORD_RESET]: 60 * 60 * 2, // 2 hours
//     [TokenType.EMAIL_CHANGE]: 60 * 60, // 1 hour
//   };

//   const token = await generateTokenString(32);
//   const now = new Date();
//   const expiresAt = new Date(
//     now.getTime() + 1000 * (ttlSeconds ?? defaultTTLs[type])
//   );

//   const created = await Token.create({
//     userId,
//     email,
//     token,
//     type,
//     used: false,
//     expiresAt,
//   });

//   return created;
// }

// export async function findValidToken(tokenValue: string, type?: TokenType) {
//   await connectToDB();

//   const query: any = { token: tokenValue, used: false };
//   if (type) query.type = type;

//   const tokenDoc = await Token.findOne(query); // TokenDocument | null
//   if (!tokenDoc) return null;

//   if (tokenDoc.expiresAt && tokenDoc.expiresAt < new Date()) {
//     tokenDoc.used = true;
//     await tokenDoc.save();
//     return null;
//   }

//   return tokenDoc;
// }

// export async function markTokenUsed(tokenDoc: TokenDocument) {
//   tokenDoc.used = true;
//   await tokenDoc.save();
// }

// export async function revokeTokensForUser(userId: string, type?: TokenType) {
//   await connectToDB();
//   const q: any = { userId };
//   if (type) q.type = type;
//   await Token.updateMany(q, { used: true });
// }

// // == tokenService index export ==
// // export default {
// //   createToken,
// //   findValidToken,
// //   markTokenUsed,
// //   revokeTokensForUser,
// //   generateTokenString,
// // };
