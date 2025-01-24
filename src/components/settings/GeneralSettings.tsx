import React, { useState, useRef } from 'react';
import { Camera, Download, Save } from 'lucide-react';
import { AspectRatio, ASPECT_RATIOS } from '../../types/SettingsTypes';
import { Project } from '../../types/ProjectTypes';
import { saveProject } from '../../utils/projectStorage';

interface GeneralSettingsProps {
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  currentProject: Project;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  aspectRatio,
  onAspectRatioChange,
  currentProject,
}) => {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const notificationTimeout = useRef<number | null>(null);

  const handleTakeScreenshot = () => {
    const chartContent = document.querySelector('.chart-content') as HTMLElement;
    if (!chartContent) return;

    // Get the original dimensions
    const originalWidth = chartContent.offsetWidth;
    const originalHeight = chartContent.offsetHeight;

    // Create a temporary container with fixed dimensions
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = `${originalWidth}px`;
    tempContainer.style.height = `${originalHeight}px`;
    
    // Clone the chart content
    const clone = chartContent.cloneNode(true) as HTMLElement;
    clone.style.transform = 'none'; // Remove any transforms
    clone.style.width = '100%';
    clone.style.height = '100%';
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    import('html2canvas').then((html2canvas) => {
      html2canvas.default(tempContainer, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: originalWidth,
        height: originalHeight,
        onclone: (doc) => {
          const clonedElement = doc.querySelector('.chart-content') as HTMLElement;
          if (clonedElement) {
            const elements = clonedElement.querySelectorAll('*');
            elements.forEach((el) => {
              if (el instanceof HTMLElement) {
                const style = window.getComputedStyle(el);
                if (style.position === 'absolute') {
                  el.style.transform = 'none';
                  el.style.position = 'absolute';
                }
              }
            });
          }
        }
      }).then((canvas) => {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setScreenshot(dataUrl);
        document.body.removeChild(tempContainer);
      });
    });
  };

  const handleDownloadScreenshot = () => {
    if (!screenshot) return;

    const link = document.createElement('a');
    link.href = screenshot;
    link.download = 'chart-screenshot.jpg';
    link.click();
  };

  const showNotification = (message: string) => {
    // Remove any existing notification
    const existingNotification = document.querySelector('.save-notification');
    if (existingNotification) {
      document.body.removeChild(existingNotification);
    }

    // Clear any existing timeout
    if (notificationTimeout.current) {
      window.clearTimeout(notificationTimeout.current);
    }

    const notification = document.createElement('div');
    notification.className = 'save-notification fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Set new timeout
    notificationTimeout.current = window.setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      notificationTimeout.current = null;
    }, 3000);
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await saveProject(currentProject);
      showNotification('Proyecto guardado correctamente');
    } catch (error) {
      console.error('Error saving project:', error);
      setSaveError('Error al guardar el proyecto. Por favor, intente de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (notificationTimeout.current) {
        window.clearTimeout(notificationTimeout.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Relación de aspecto
        </label>
        <select
          value={aspectRatio}
          onChange={(e) => onAspectRatioChange(e.target.value as AspectRatio)}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {Object.keys(ASPECT_RATIOS).map((ratio) => (
            <option key={ratio} value={ratio}>
              {ratio} {ratio === '16:9' ? '(predeterminado)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={handleTakeScreenshot}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Camera className="w-5 h-5 mr-2" />
            <span>Tomar Captura</span>
          </button>

          {screenshot && (
            <button
              onClick={handleDownloadScreenshot}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              <span>Descargar Captura</span>
            </button>
          )}
        </div>

        {screenshot && (
          <div className="border rounded-lg p-2">
            <img
              src={screenshot}
              alt="Vista previa de la captura"
              className="w-full rounded"
            />
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <button
          onClick={handleManualSave}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
        >
          <Save className="w-5 h-5 mr-2" />
          <span>{isSaving ? 'Guardando...' : 'Guardar Proyecto'}</span>
        </button>
        {saveError && (
          <p className="mt-2 text-sm text-red-500">{saveError}</p>
        )}
      </div>
    </div>
  );
};