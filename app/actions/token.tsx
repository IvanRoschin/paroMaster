import { TokenDocument, TokenType } from '@/models/Token';

import {
  CreateTokenOpts,
  createTokenService,
  findValidTokenService,
  markTokenUsedService,
} from '../services/tokenService';

export async function createTokenAction(opts: CreateTokenOpts) {
  return createTokenService(opts);
}

export async function findValidTokenAction(
  tokenValue: string,
  type?: TokenType
) {
  return findValidTokenService(tokenValue, type);
}

export async function markTokenUsedAction(tokenDoc: TokenDocument) {
  return markTokenUsedService(tokenDoc);
}
