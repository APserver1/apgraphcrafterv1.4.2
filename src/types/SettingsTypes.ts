// Types
export type AspectRatio = '1:1' | '3:4' | '5:3' | '16:9';
export type ImagePosition = 'behind' | 'front';
export type LabelPosition = 'behind' | 'inside';
export type BarAnimationType = 'instant' | 'transition';
export type BarJumpType = 'instant' | 'smooth';
export type ImageShape = 'circle' | 'square' | 'rectangle' | 'original' | 'custom';
export type EmptyCellHandling = 'zero' | 'interpolate';
export type EmbeddingPosition = 'front' | 'behind';
export type FlipStyle = 'none' | 'imageVertical' | 'imageHorizontal' | 'borderVertical' | 'borderHorizontal';

// Constants
export const ASPECT_RATIOS: Record<AspectRatio, number> = {
  '1:1': 1,
  '3:4': 3/4,
  '5:3': 5/3,
  '16:9': 16/9,
};

// Interfaces
interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface EmbeddedImage {
  url: string;
  width: number;
  height: number;
  position: EmbeddingPosition;
  margins: Margins;
}

interface EmbeddedText {
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  position: EmbeddingPosition;
  margins: Margins;
}

interface CarouselSettings {
  enabled: boolean;
  width: number;
  height: number;
  margins: Margins;
  images: Record<string, string>;
}

interface TextCarouselSettings {
  enabled: boolean;
  fontSize: number;
  fontFamily: string;
  color: string;
  margins: Margins;
  texts: Record<string, string>;
}

export interface ChartSettings {
  aspectRatio: AspectRatio;
  margins: Margins;
  bars: {
    maxCount: number;
    spacing: number;
    descendingWidth: boolean;
    descendingRatio: number;
    descendingHeight: boolean;
    heightRatio: number;
    keepSpacing: boolean;
    useCustomSpacing: boolean;
    customSpacing: number[];
    animationType: BarAnimationType;
    roundedCorners: {
      enabled: boolean;
      radius: number;
    };
  };
  values: {
    showAtEnd: boolean;
    emptyCellHandling: EmptyCellHandling;
    color: string;
  };
  images: {
    position: ImagePosition;
    size: number;
    spacing: number;
    descendingWidth: boolean;
    widthRatio: number;
    descendingHeight: boolean;
    heightRatio: number;
    border: {
      enabled: boolean;
      width: number;
      spacing: number;
      descendingWidth: boolean;
      widthRatio: number;
      descendingSpacing: boolean;
      spacingRatio: number;
    };
  };
  labels: {
    position: LabelPosition;
    color: string;
    fontFamily: string;
    size: number;
    spacing: number;
    descendingSize: boolean;
    sizeRatio: number;
    invisible: boolean;
  };
  timeline: {
    duration: number;
    loop: boolean;
    loopDelayBefore: number;
    loopDelayAfter: number;
  };
  animations: {
    barJump: BarJumpType;
    jumpDuration: number;
    entryDuration: number;
    growthDuration: number; // Nueva propiedad para la duración de la animación horizontal
    flipStyle: FlipStyle;
  };
  dateDisplay: {
    show: boolean;
    position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
    fontSize: number;
    color: string;
    margins: Margins;
    backgroundColor: string | null;
  };
  imageColumn: {
    enabled: boolean;
    position: 'left' | 'right';
    imageShape: ImageShape;
    size: number;
    spacing: number;
    descendingSize: boolean;
    sizeRatio: number;
    useCustomSpacing: boolean;
    customSpacing: number[];
    customWidth: number;
    customHeight: number;
    margins: Margins;
    defaultImage: string;
    images: Record<string, string>;
  };
  background: {
    enabled: boolean;
    color: string;
  };
  embeddings: {
    enabled: boolean;
    images: EmbeddedImage[];
    texts: EmbeddedText[];
  };
  carousel: CarouselSettings;
  textCarousel: TextCarouselSettings;
}