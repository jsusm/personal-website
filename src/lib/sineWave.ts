export function wave(
  step: number,
  amplitude: number,
  period: number,
  offset = 0,
  move = 0,
): number {
  return Math.sin(((step + offset) / period) - move) * amplitude;
}
