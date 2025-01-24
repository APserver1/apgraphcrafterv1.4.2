import { ChartSettings } from '../types/SettingsTypes';

export const defaultSettings: ChartSettings = {
  aspectRatio: '16:9',
  margins: {
    top: 32,
    right: 32,
    bottom: 32,
    left: 200
  },
  bars: {
    maxCount: 10,
    spacing: 8,
    descendingWidth: false,
    descendingRatio: 0.75,
    descendingHeight: false,
    heightRatio: 0.75,
    keepSpacing: false,
    useCustomSpacing: false,
    customSpacing: [],
    animationType: 'transition',
    roundedCorners: {
      enabled: false,
      radius: 8
    }
  },
  values: {
    showAtEnd: true,
    emptyCellHandling: 'zero',
    color: '#000000'
  },
  images: {
    position: 'behind',
    size: 32,
    spacing: 8,
    descendingWidth: false,
    widthRatio: 0.75,
    descendingHeight: false,
    heightRatio: 0.75,
    border: {
      enabled: false,
      width: 2,
      spacing: 2,
      descendingWidth: false,
      widthRatio: 0.75,
      descendingSpacing: false,
      spacingRatio: 0.75
    }
  },
  labels: {
    position: 'behind',
    color: '#000000',
    fontFamily: 'sans-serif',
    size: 14,
    spacing: 8,
    descendingSize: false,
    sizeRatio: 0.75,
    invisible: false
  },
  timeline: {
    duration: 30,
    loop: false,
    loopDelayBefore: 1,
    loopDelayAfter: 1
  },
  animations: {
    barJump: 'instant',
    jumpDuration: 0.3,
    entryDuration: 0.3,
    growthDuration: 0.3, // Duración por defecto para la animación horizontal
    flipStyle: 'none'
  },
  dateDisplay: {
    show: true,
    position: 'bottomRight',
    fontSize: 16,
    color: '#ffffff',
    margins: {
      top: 16,
      bottom: 16,
      left: 16,
      right: 16
    },
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  imageColumn: {
    enabled: false,
    position: 'left',
    imageShape: 'circle',
    size: 32,
    spacing: 8,
    descendingSize: false,
    sizeRatio: 0.75,
    useCustomSpacing: false,
    customSpacing: [],
    customWidth: 32,
    customHeight: 32,
    margins: {
      top: 32,
      bottom: 32,
      left: 32,
      right: 32
    },
    defaultImage: 'https://via.placeholder.com/32',
    images: {}
  },
  background: {
    enabled: false,
    color: '#ffffff'
  },
  embeddings: {
    enabled: false,
    images: [],
    texts: []
  },
  carousel: {
    enabled: false,
    width: 200,
    height: 200,
    margins: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50
    },
    images: {}
  },
  textCarousel: {
    enabled: false,
    fontSize: 32,
    fontFamily: 'sans-serif',
    color: '#000000',
    margins: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50
    },
    texts: {}
  }
};