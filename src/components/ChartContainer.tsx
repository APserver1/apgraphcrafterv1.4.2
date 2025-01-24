import React, { useState, useRef, useEffect } from 'react';
import { ASPECT_RATIOS } from '../types/SettingsTypes';
import { BarChart } from './BarChart';
import { ParsedData } from '../types/DataTypes';
import { ChartSettings } from '../types/SettingsTypes';
import { useInterpolatedData } from '../hooks/useInterpolatedData';
import { ImageColumn } from './ImageColumn';
import { DateDisplay } from './DateDisplay';
import { FullscreenButton } from './FullscreenButton';
import { EmbeddedImages } from './EmbeddedImages';
import { Timeline } from './Timeline';
import { CarouselImages } from './CarouselImages';
import { TextCarousel } from './TextCarousel';
import html2canvas from 'html2canvas';

interface ChartContainerProps {
  data: ParsedData;
  currentIndex: number;
  isPlaying: boolean;
  aspectRatio: keyof typeof ASPECT_RATIOS;
  barSettings: ChartSettings['bars'];
  margins: ChartSettings['margins'];
  valueSettings: ChartSettings['values'];
  imageSettings: ChartSettings['images'];
  labelSettings: ChartSettings['labels'];
  animations: ChartSettings['animations'];
  dateDisplay: ChartSettings['dateDisplay'];
  imageColumn: ChartSettings['imageColumn'];
  background: ChartSettings['background'];
  embeddings: ChartSettings['embeddings'];
  carousel: ChartSettings['carousel'];
  textCarousel: ChartSettings['textCarousel'];
  onPlayPause: () => void;
  onTimelineChange: (index: number) => void;
  onThumbnailCapture?: (thumbnail: string) => void;
  hideTimeline?: boolean;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  data,
  currentIndex,
  isPlaying,
  aspectRatio,
  barSettings,
  margins,
  valueSettings,
  imageSettings,
  labelSettings,
  animations,
  dateDisplay,
  imageColumn,
  background,
  embeddings,
  carousel,
  textCarousel,
  onPlayPause,
  onTimelineChange,
  onThumbnailCapture,
  hideTimeline = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const { interpolatedData } = useInterpolatedData(data, currentIndex, isPlaying);

  const safeBarSettings = {
    ...barSettings,
    maxCount: barSettings?.maxCount ?? 10
  };

  const ratio = ASPECT_RATIOS[aspectRatio];

  useEffect(() => {
    if (onThumbnailCapture && chartRef.current) {
      const captureChart = async () => {
        try {
          const chartElement = chartRef.current!.querySelector('.chart-content');
          if (!chartElement) return;

          const canvas = await html2canvas(chartElement as HTMLElement, {
            backgroundColor: background.enabled ? background.color : '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
          });

          onThumbnailCapture(canvas.toDataURL('image/jpeg', 0.9));
        } catch (error) {
          console.error('Error capturing thumbnail:', error);
        }
      };
      captureChart();
    }
  }, [onThumbnailCapture, ratio, background]);

  useEffect(() => {
    if (isExpanded && containerRef.current && chartRef.current) {
      const calculateDimensions = () => {
        const container = containerRef.current;
        const chart = chartRef.current;
        if (!container || !chart) return;

        const availableWidth = window.innerWidth;
        const availableHeight = window.innerHeight - 120;

        let targetWidth = availableWidth - 64;
        let targetHeight = targetWidth / ratio;

        if (targetHeight > availableHeight) {
          targetHeight = availableHeight;
          targetWidth = targetHeight * ratio;
        }

        chart.style.width = `${targetWidth}px`;
        chart.style.height = `${targetHeight}px`;
      };

      calculateDimensions();
      window.addEventListener('resize', calculateDimensions);
      return () => window.removeEventListener('resize', calculateDimensions);
    }
  }, [isExpanded, ratio]);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const containerClasses = isExpanded 
    ? 'fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8'
    : 'relative w-full bg-white';

  const chartContainerClasses = isExpanded
    ? 'relative border-2 border-black rounded-lg overflow-hidden'
    : 'relative w-full border-2 border-black rounded-lg overflow-hidden';

  const chartStyle = !isExpanded ? {
    paddingTop: `${(1 / ratio) * 100}%`
  } : undefined;

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
    >
      <FullscreenButton 
        isExpanded={isExpanded} 
        onToggle={handleExpand}
      />
      
      <div 
        ref={chartRef}
        className={chartContainerClasses}
        style={chartStyle}
      >
        <div className="absolute inset-0">
          <div className="chart-content absolute inset-0">
            {background.enabled && (
              <div 
                className="absolute inset-0" 
                style={{ backgroundColor: background.color }}
              />
            )}
            {embeddings.enabled && (
              <EmbeddedImages 
                images={embeddings.images} 
                texts={embeddings.texts}
              />
            )}
            <CarouselImages
              settings={carousel}
              currentLabel={data.labels[Math.floor(currentIndex)]}
            />
            <TextCarousel
              settings={textCarousel}
              currentLabel={data.labels[Math.floor(currentIndex)]}
            />
            <ImageColumn
              data={interpolatedData}
              currentIndex={0}
              settings={imageColumn}
              maxBars={safeBarSettings.maxCount}
            />
            <BarChart
              data={interpolatedData}
              currentIndex={0}
              barSettings={safeBarSettings}
              margins={margins}
              valueSettings={valueSettings}
              imageSettings={imageSettings}
              labelSettings={labelSettings}
              animations={animations}
            />
            <DateDisplay
              currentLabel={data.labels[Math.floor(currentIndex)]}
              settings={dateDisplay}
            />
          </div>
        </div>
      </div>
      
      {!hideTimeline && (
        <div className="w-full max-w-[1200px] mt-6 mx-auto">
          <Timeline
            labels={data.labels}
            currentIndex={currentIndex}
            isPlaying={isPlaying}
            onIndexChange={onTimelineChange}
            onPlayPause={onPlayPause}
          />
        </div>
      )}
    </div>
  );
};