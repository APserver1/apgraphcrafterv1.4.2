/**
 * Calculates the bar width based on value and settings
 */
export function calculateBarWidth(
  value: number,
  maxValue: number,
  index: number,
  isDescending: boolean,
  ratio: number
): string {
  const basePercentage = (value / maxValue) * 100;
  
  if (!isDescending) {
    return `${basePercentage}%`;
  }

  const position = Math.min(index, 9) / 9;
  const reductionFactor = 1 - ((1 - ratio) * position);
  
  return `${basePercentage * reductionFactor}%`;
}

/**
 * Calculates the bar height based on settings
 */
export function calculateBarHeight(
  baseHeight: number,
  index: number,
  isDescending: boolean,
  ratio: number
): number {
  if (!isDescending) {
    return baseHeight;
  }

  const position = Math.min(index, 9) / 9;
  const reductionFactor = 1 - ((1 - ratio) * position);
  
  return Math.floor(baseHeight * reductionFactor);
}

/**
 * Gets the spacing between bars based on index
 */
export function getBarSpacing(
  index: number,
  settings: {
    useCustomSpacing: boolean;
    customSpacing: number[];
    spacing: number;
  }
): number {
  if (settings.useCustomSpacing && Array.isArray(settings.customSpacing)) {
    return settings.customSpacing[index] ?? settings.spacing;
  }
  return settings.spacing;
}