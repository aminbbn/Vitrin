import { generateRefreshToken, hashToken } from './token-hasher';

describe('token-hasher', () => {
  describe('generateRefreshToken', () => {
    it('should generate a non-empty string', () => {
      const token = generateRefreshToken();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate unique tokens', () => {
      const token1 = generateRefreshToken();
      const token2 = generateRefreshToken();
      expect(token1).not.toBe(token2);
    });

    it('should generate base64url-safe tokens', () => {
      const token = generateRefreshToken();
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    });
  });

  describe('hashToken', () => {
    it('should return a 64-character hex string (SHA-256)', () => {
      const hash = hashToken('test-token');
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should be deterministic for the same input', () => {
      const hash1 = hashToken('test-token');
      const hash2 = hashToken('test-token');
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = hashToken('token-1');
      const hash2 = hashToken('token-2');
      expect(hash1).not.toBe(hash2);
    });
  });
});
