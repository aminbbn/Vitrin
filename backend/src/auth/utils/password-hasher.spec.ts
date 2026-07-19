import { hashPassword, verifyPassword } from './password-hasher';

describe('password-hasher', () => {
  describe('hashPassword', () => {
    it('should return a hash containing a colon separator', async () => {
      const result = await hashPassword('Password123!');
      expect(result.hash).toContain(':');
    });

    it('should produce different hashes for the same password (unique salts)', async () => {
      const result1 = await hashPassword('Password123!');
      const result2 = await hashPassword('Password123!');
      expect(result1.hash).not.toBe(result2.hash);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const { hash } = await hashPassword('Password123!');
      const result = await verifyPassword('Password123!', hash);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const { hash } = await hashPassword('Password123!');
      const result = await verifyPassword('WrongPassword!', hash);
      expect(result).toBe(false);
    });

    it('should return false for malformed hash', async () => {
      const result = await verifyPassword('Password123!', 'not-a-hash');
      expect(result).toBe(false);
    });

    it('should return false for empty hash', async () => {
      const result = await verifyPassword('Password123!', '');
      expect(result).toBe(false);
    });
  });
});
