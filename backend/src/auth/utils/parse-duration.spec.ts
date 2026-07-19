import { parseDuration } from './parse-duration';

describe('parseDuration', () => {
  it('should parse seconds', () => {
    expect(parseDuration('30s')).toBe(30000);
  });

  it('should parse minutes', () => {
    expect(parseDuration('15m')).toBe(900000);
  });

  it('should parse hours', () => {
    expect(parseDuration('1h')).toBe(3600000);
  });

  it('should parse days', () => {
    expect(parseDuration('7d')).toBe(604800000);
  });

  it('should handle uppercase suffixes', () => {
    expect(parseDuration('15M')).toBe(900000);
  });

  it('should throw for invalid format', () => {
    expect(() => parseDuration('invalid')).toThrow('Invalid duration format');
  });

  it('should throw for missing number', () => {
    expect(() => parseDuration('m')).toThrow('Invalid duration format');
  });
});
