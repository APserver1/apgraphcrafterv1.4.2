import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParsedData } from '../types/DataTypes';
import { ChartSettings } from '../types/SettingsTypes';
import { AnimatedCounter } from './AnimatedCounter';
import { calculateBarWidth, calculateBarHeight } from '../utils/barCalculations';
import { calculateImageSize } from '../utils/imageCalculations';
import { calculateLabelSize } from '../utils/labelCalculations';

interface BarChartProps {
  data: ParsedData;
  currentIndex: number;
  barSettings: ChartSettings['bars'];
  margins: ChartSettings['margins'];
  valueSettings: ChartSettings['values'];
  imageSettings: ChartSettings['images'];
  labelSettings: ChartSettings['labels'];
  animations: ChartSettings['animations'];
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  currentIndex,
  barSettings,
  margins,
  valueSettings,
  imageSettings,
  labelSettings,
  animations,
}) => {
  const [flippingBars, setFlippingBars] = useState<Set<string>>(new Set());
  const [visibleBars, setVisibleBars] = useState<Set<string>>(new Set());
  const previousPositionsRef = useRef<Map<string, number>>(new Map());
  const timeoutRef = useRef<number>();

  if (!data) return null;

  const sortedData = useMemo(() => {
    return [...data.data]
      .sort((a, b) => b.values[currentIndex] - a.values[currentIndex])
      .slice(0, barSettings.maxCount);
  }, [data, currentIndex, barSettings.maxCount]);

  const currentPositions = useMemo(() => {
    return new Map(sortedData.map((item, index) => [item.label, index]));
  }, [sortedData]);

  useEffect(() => {
    const previousPositions = previousPositionsRef.current;
    const newFlippingBars = new Set<string>();
    const newVisibleBars = new Set<string>();

    currentPositions.forEach((currentIndex, label) => {
      const previousIndex = previousPositions.get(label);
      
      // Si la barra no estaba visible antes, es una nueva entrada
      if (previousIndex === undefined) {
        newVisibleBars.add(label);
      }
      // Si la barra cambia de posición, necesita animación de flip
      else if (previousIndex !== currentIndex) {
        newFlippingBars.add(label);
        
        // También añadir la barra que está siendo superada
        for (const [prevLabel, prevIndex] of previousPositions.entries()) {
          if (prevIndex === currentIndex) {
            newFlippingBars.add(prevLabel);
            break;
          }
        }
      }
    });

    if (newFlippingBars.size > 0) {
      setFlippingBars(newFlippingBars);
      
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = window.setTimeout(() => {
        setFlippingBars(new Set());
      }, animations.jumpDuration * 1000);
    }

    if (newVisibleBars.size > 0) {
      setVisibleBars(newVisibleBars);
      setTimeout(() => {
        setVisibleBars(new Set());
      }, animations.entryDuration * 1000);
    }

    previousPositionsRef.current = currentPositions;

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [currentPositions, animations.jumpDuration, animations.entryDuration]);

  const maxValue = Math.max(...sortedData.map(item => item.values[currentIndex]));
  const totalBars = barSettings.keepSpacing ? barSettings.maxCount : sortedData.length;

  const baseBarSpacing = barSettings.spacing;
  const availableHeight = 600 - margins.top - margins.bottom;
  const barHeight = Math.floor((availableHeight - (Math.max(0, baseBarSpacing) * (totalBars - 1))) / totalBars);

  const displayBars = barSettings.keepSpacing
    ? Array(totalBars).fill(null).map((_, i) => sortedData[i] || null)
    : sortedData;

  const getPosition = (index: number): number => {
    if (barSettings.useCustomSpacing) {
      let position = 0;
      for (let i = 0; i < index; i++) {
        position += barHeight + (barSettings.customSpacing[i] ?? barSettings.spacing);
      }
      return position;
    }
    return index * (barHeight + barSettings.spacing);
  };

  const getTransition = (label: string, property: 'position' | 'width') => {
    if (animations.barJump === 'smooth') {
      const isFlipping = flippingBars.has(label);
      const isEntering = visibleBars.has(label);
      
      return {
        type: isFlipping ? "tween" : "spring",
        duration: property === 'position' 
          ? (isEntering ? animations.entryDuration : animations.jumpDuration)
          : animations.growthDuration,
        bounce: isFlipping ? 0 : 0.2,
        ease: isFlipping ? "linear" : undefined
      };
    }
    return {
      duration: 0
    };
  };

  const getFlipAnimation = (label: string) => {
    if (animations.barJump !== 'smooth' || 
        !animations.flipStyle || 
        animations.flipStyle === 'none' || 
        !flippingBars.has(label)) {
      return null;
    }

    const rotateAxis = animations.flipStyle.includes('Vertical') ? 'rotateX' : 'rotateY';
    return {
      [rotateAxis]: [0, 720]
    };
  };

  const calculateBorderWidth = (index: number): number => {
    if (!imageSettings.border.descendingWidth) {
      return imageSettings.border.width;
    }
    const position = Math.min(index, 9) / 9;
    const reductionFactor = 1 - ((1 - imageSettings.border.widthRatio) * position);
    return Math.max(1, Math.floor(imageSettings.border.width * reductionFactor));
  };

  const calculateBorderSpacing = (index: number): number => {
    if (!imageSettings.border.descendingSpacing) {
      return imageSettings.border.spacing;
    }
    const position = Math.min(index, 9) / 9;
    const reductionFactor = 1 - ((1 - imageSettings.border.spacingRatio) * position);
    return Math.max(0, Math.floor(imageSettings.border.spacing * reductionFactor));
  };

  const renderImage = (item: ParsedData['data'][0], imageSize: { width: string; height: string }, index: number) => {
    if (!item || !item.image) return null;

    const shouldFlipImage = animations.flipStyle && animations.flipStyle.startsWith('image');
    const shouldFlipBorder = animations.flipStyle && animations.flipStyle.startsWith('border');
    const isFlipping = flippingBars.has(item.label);
    const flipAnimation = getFlipAnimation(item.label);

    if (!imageSettings.border.enabled) {
      return (
        <motion.img
          src={item.image}
          alt={item.label}
          className="rounded-full flex-shrink-0"
          style={imageSize}
          animate={flipAnimation && shouldFlipImage ? flipAnimation : { rotateX: 0, rotateY: 0 }}
          transition={getTransition(item.label, 'position')}
        />
      );
    }

    const borderWidth = calculateBorderWidth(index);
    const borderSpacing = calculateBorderSpacing(index);
    const totalSize = {
      width: `${parseInt(imageSize.width) + (borderWidth + borderSpacing) * 2}px`,
      height: `${parseInt(imageSize.height) + (borderWidth + borderSpacing) * 2}px`
    };

    return (
      <div 
        className="relative flex-shrink-0" 
        style={totalSize}
      >
        <motion.div 
          className="absolute inset-0 rounded-full"
          style={{ 
            border: `${borderWidth}px solid ${item.color}`,
            opacity: 0.9
          }}
          animate={flipAnimation && shouldFlipBorder ? flipAnimation : { rotateX: 0, rotateY: 0 }}
          transition={getTransition(item.label, 'position')}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            padding: `${borderWidth + borderSpacing}px`
          }}
          animate={flipAnimation && shouldFlipImage ? flipAnimation : { rotateX: 0, rotateY: 0 }}
          transition={getTransition(item.label, 'position')}
        >
          <img
            src={item.image}
            alt={item.label}
            className="w-full h-full rounded-full object-cover"
          />
        </motion.div>
      </div>
    );
  };

  return (
    <div 
      className="w-full h-full overflow-hidden"
      style={{
        padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`
      }}
    >
      <div className="relative h-full">
        <AnimatePresence>
          {displayBars.map((item, index) => {
            if (!item) {
              return (
                <motion.div
                  key={`empty-${index}`}
                  className="absolute left-0 right-0"
                  style={{
                    top: getPosition(index),
                    height: barHeight
                  }}
                />
              );
            }

            const percentage = (item.values[currentIndex] / maxValue) * 100;
            const barWidth = calculateBarWidth(
              item.values[currentIndex],
              maxValue,
              index,
              barSettings.descendingWidth,
              barSettings.descendingRatio
            );
            const currentBarHeight = calculateBarHeight(
              barHeight,
              index,
              barSettings.descendingHeight,
              barSettings.heightRatio
            );
            const topPosition = getPosition(index);
            const imageSize = calculateImageSize(index, imageSettings.size, imageSettings);
            const fontSize = calculateLabelSize(index, labelSettings.size, labelSettings);

            const roundedStyle = barSettings.roundedCorners?.enabled
              ? { borderRadius: `0 ${barSettings.roundedCorners.radius}px ${barSettings.roundedCorners.radius}px 0` }
              : {};

            return (
              <motion.div
                key={item.label}
                className="absolute left-0 right-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  top: topPosition,
                  height: currentBarHeight,
                }}
                transition={getTransition(item.label, 'position')}
                style={{
                  top: topPosition,
                  height: currentBarHeight,
                }}
              >
                <div className="relative w-full h-full flex items-center">
                  {labelSettings.position === 'behind' && (
                    <div 
                      className="absolute right-full top-1/2 -translate-y-1/2 flex items-center whitespace-nowrap"
                      style={{ 
                        marginRight: `${labelSettings.spacing}px`,
                        color: labelSettings.invisible ? 'transparent' : labelSettings.color,
                        fontFamily: labelSettings.fontFamily,
                        fontSize: `${fontSize}px`,
                      }}
                    >
                      {imageSettings.position === 'behind' && renderImage(item, imageSize, index)}
                      {item.label}
                    </div>
                  )}

                  <div className="relative flex-1 h-full flex items-center">
                    <motion.div
                      className="relative bg-opacity-90"
                      style={{ 
                        backgroundColor: item.color,
                        width: barWidth,
                        height: currentBarHeight,
                        minWidth: '2%',
                        ...roundedStyle
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: barWidth }}
                      transition={getTransition(item.label, 'width')}
                    >
                      {labelSettings.position === 'inside' && (
                        <div
                          className="absolute left-2 top-1/2 -translate-y-1/2 whitespace-nowrap"
                          style={{
                            color: labelSettings.invisible ? 'transparent' : labelSettings.color,
                            fontFamily: labelSettings.fontFamily,
                            fontSize: `${fontSize}px`,
                          }}
                        >
                          {item.label}
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 flex items-center gap-2"
                      style={{ 
                        left: `calc(${percentage}% + ${imageSettings.position === 'front' ? imageSettings.spacing : 0}px)`,
                      }}
                      initial={{ left: '0%' }}
                      animate={{ left: `calc(${percentage}% + ${imageSettings.position === 'front' ? imageSettings.spacing : 0}px)` }}
                      transition={getTransition(item.label, 'position')}
                    >
                      {imageSettings.position === 'front' && renderImage(item, imageSize, index)}

                      {valueSettings.showAtEnd && (
                        <div 
                          className="font-bold whitespace-nowrap"
                          style={{ color: valueSettings.color }}
                        >
                          <AnimatedCounter 
                            value={item.values[currentIndex]} 
                            animationType={barSettings.animationType}
                          />
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};