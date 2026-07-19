import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const SALT_LENGTH = 32;
const KEY_LENGTH = 64;
const SCRYPT_COST = 16384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;

function scryptHash(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      KEY_LENGTH,
      { cost: SCRYPT_COST, blockSize: SCRYPT_BLOCK_SIZE, parallelization: SCRYPT_PARALLELIZATION },
      (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey as Buffer);
      },
    );
  });
}

export interface PasswordHasherResult {
  hash: string;
}

export async function hashPassword(password: string): Promise<PasswordHasherResult> {
  const salt = randomBytes(SALT_LENGTH);
  const key = await scryptHash(password, salt);
  const hash = `${salt.toString('hex')}:${key.toString('hex')}`;
  return { hash };
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [saltHex, keyHex] = storedHash.split(':');
  if (!saltHex || !keyHex) return false;

  const salt = Buffer.from(saltHex, 'hex');
  const expectedKey = Buffer.from(keyHex, 'hex');
  const candidateKey = await scryptHash(password, salt);

  if (candidateKey.length !== expectedKey.length) return false;

  return timingSafeEqual(candidateKey, expectedKey);
}
