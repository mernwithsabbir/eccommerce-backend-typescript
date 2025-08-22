// utils/duration.ts
export function getExpiryDate(str: string, fallbackMs: number): Date {
  const match = str.trim().match(/^(\d+)([smhd]?)$/);
  if (!match) return new Date(Date.now() + fallbackMs);

  const value = parseInt(match[1], 10);
  const unit = match[2] || "s";

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const ms = value * multipliers[unit];
  return new Date(Date.now() + ms);
}
