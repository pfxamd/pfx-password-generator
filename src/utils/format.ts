export function formatBits(bits: number): string {
  if (!Number.isFinite(bits)) {
    return "—";
  }

  return bits >= 100 ? Math.round(bits).toString() : bits.toFixed(1);
}

export function formatCombinations(value: bigint): string {
  const raw = value.toString();

  if (raw.length <= 12) {
    return new Intl.NumberFormat("en-US").format(value);
  }

  const decimals = raw.slice(1, 3);
  return `${raw[0]}.${decimals} × 10^${raw.length - 1}`;
}
