export function calculateLabelSize(
  index: number,
  baseSize: number,
  settings: {
    descendingSize: boolean;
    sizeRatio: number;
  }
): number {
  if (!settings.descendingSize) {
    return baseSize;
  }

  const position = Math.min(index, 9) / 9;
  const reductionFactor = 1 - ((1 - settings.sizeRatio) * position);
  
  return Math.floor(baseSize * reductionFactor);
}