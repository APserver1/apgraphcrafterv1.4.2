import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageColumnSettings, ImageShape } from '../types/SettingsTypes';
import { ParsedData } from '../types/DataTypes';
import { calculateImageSize } from '../utils/imageCalculations';

interface ImageColumnProps {
  data: ParsedData;
  currentIndex: number;
  settings: ImageColumnSettings;
  maxBars?: number;
}

const getImageClassName = (shape: ImageShape): string => {
  switch (shape) {
    case 'circle':
      return 'rounded-full';
    case 'square':
      return 'rounded-none';
    case 'rectangle':
      return 'rounded-none aspect-[16/9] object-cover';
    case 'original':
      return '';
    case 'custom':
      return 'rounded-none';
    default:
      return 'rounded-full';
  }
};

export const ImageColumn: React.FC<ImageColumnProps> = ({
  data,
  currentIndex,
  settings,
  maxBars = 10,
}) => {
  if (!settings?.enabled) return null;

  const { margins } = settings;
  
  // Sort data by values for current index
  const sortedData = [...data.data]
    .sort((a, b) => b.values[currentIndex] - a.values[currentIndex])
    .slice(0, maxBars);

  // Calculate position for each bar
  const getPosition = (index: number): number => {
    if (settings.useCustomSpacing) {
      let position = 0;
      for (let i = 0; i < index; i++) {
        position += settings.size + (settings.customSpacing[i] ?? settings.spacing);
      }
      return position;
    }
    return index * (settings.size + settings.spacing);
  };

  // Calculate container width based on image shape
  const containerWidth = settings.imageShape === 'custom' 
    ? Math.max(settings.customWidth, settings.size)
    : settings.size;

  return (
    <div 
      className={`absolute ${settings.position === 'left' ? 'left-0' : 'right-0'}`}
      style={{ 
        top: margins.top,
        bottom: margins.bottom,
        width: containerWidth,
        marginLeft: settings.position === 'right' ? settings.spacing : margins.left,
        marginRight: settings.position === 'left' ? settings.spacing : margins.right,
      }}
    >
      <div className="relative h-full">
        <AnimatePresence mode="sync">
          {sortedData.map((item, index) => {
            const imageUrl = settings.images[item.label] || settings.defaultImage;
            let imageSize = calculateImageSize(index, settings.size, {
              descendingWidth: settings.descendingSize,
              widthRatio: settings.sizeRatio,
              descendingHeight: settings.descendingSize,
              heightRatio: settings.sizeRatio,
            });

            // Override size for custom shape with descending size support
            if (settings.imageShape === 'custom') {
              const sizeReduction = settings.descendingSize 
                ? 1 - ((1 - settings.sizeRatio) * (Math.min(index, 9) / 9))
                : 1;
              
              imageSize = {
                width: `${Math.floor(settings.customWidth * sizeReduction)}px`,
                height: `${Math.floor(settings.customHeight * sizeReduction)}px`
              };
            }

            return (
              <motion.div
                key={item.label}
                className={`absolute ${settings.position === 'left' ? 'left-0' : 'right-0'}`}
                initial={{ opacity: 0, x: settings.position === 'left' ? -20 : 20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  top: getPosition(index),
                  height: imageSize.height,
                }}
                exit={{ opacity: 0, x: settings.position === 'left' ? -20 : 20 }}
                transition={{ 
                  type: "spring",
                  stiffness: 80,
                  damping: 12,
                  mass: 0.8
                }}
                style={{
                  height: imageSize.height,
                  width: imageSize.width,
                }}
              >
                <img
                  src={imageUrl}
                  alt={item.label}
                  className={`absolute top-1/2 -translate-y-1/2 object-cover ${getImageClassName(settings.imageShape)}`}
                  style={{
                    ...imageSize,
                    right: settings.position === 'right' ? 0 : 'auto',
                    left: settings.position === 'left' ? 0 : 'auto'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = settings.defaultImage;
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};