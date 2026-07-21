import { randomBytes, createHash } from 'node:crypto';

const REFRESH_TOKEN_LENGTH = 48;

export function generateRefreshToken(): string {
  return randomBytes(REFRESH_TOKEN_LENGTH).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}
