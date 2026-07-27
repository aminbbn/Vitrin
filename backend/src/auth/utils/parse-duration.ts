const SUFFIX_MAP: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

export function parseDuration(value: string): number {
  const match = value.trim().match(/^(\d+)([smhd])$/i);
  if (!match) {
    throw new Error(`Invalid duration format: "${value}". Use e.g. "15m", "1h", "7d".`);
  }
  const amount = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  return amount * SUFFIX_MAP[unit];
}
