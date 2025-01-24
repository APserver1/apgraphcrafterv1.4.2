export function calculateImageSize(
  index: number,
  baseSize: number,
  settings: {
    descendingWidth: boolean;
    widthRatio: number;
    descendingHeight: boolean;
    heightRatio: number;
  }
): { width: string; height: string } {
  const width = settings.descendingWidth
    ? Math.floor(baseSize * (1 - (1 - (settings.widthRatio || 0.75)) * (index / 10)))
    : baseSize;

  const height = settings.descendingHeight
    ? Math.floor(baseSize * (1 - (1 - (settings.heightRatio || 0.75)) * (index / 10)))
    : baseSize;

  return {
    width: `${width}px`,
    height: `${height}px`
  };
}