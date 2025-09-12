'use client';
import { useState, useEffect } from 'react';
import { Smartphone, Tablet, Monitor, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface MobileOptimizationProps {
  isMobile: boolean;
  onOrientationChange?: (orientation: 'portrait' | 'landscape') => void;
  onZoomChange?: (zoom: number) => void;
}

export function MobileOptimization({
  isMobile,
  onOrientationChange,
  onZoomChange
}: MobileOptimizationProps) {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [zoom, setZoom] = useState(1);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setDeviceType('mobile');
      } else if (width <= 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    const checkOrientation = () => {
      const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      setOrientation(newOrientation);
      onOrientationChange?.(newOrientation);
    };

    checkDevice();
    checkOrientation();

    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, [onOrientationChange]);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 2);
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.5);
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  };

  const handleResetZoom = () => {
    setZoom(1);
    onZoomChange?.(1);
  };

  if (!isMobile && deviceType === 'desktop') {
    return null; // Don't show on desktop
  }

  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#d4af3740] rounded-lg p-4 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#d4af37] flex items-center gap-2">
          {deviceType === 'mobile' ? <Smartphone size={20} /> : <Tablet size={20} />}
          Mobile Optimization
        </h3>
        <div className="text-right">
          <div className="text-sm font-bold text-[#d4af37]">{deviceType}</div>
          <div className="text-xs text-gray-400 capitalize">{orientation}</div>
        </div>
      </div>

      {/* Orientation Warning */}
      {deviceType === 'mobile' && orientation === 'portrait' && (
        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <RotateCcw size={16} />
            <span>Rotate to landscape for best experience</span>
          </div>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Zoom Level</span>
          <span className="text-sm font-semibold text-[#d4af37]">{Math.round(zoom * 100)}%</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="p-2 rounded bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomOut size={16} />
          </button>

          <div className="flex-1 bg-[#2a2a2a] rounded-full h-2">
            <div
              className="bg-[#d4af37] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((zoom - 0.5) / 1.5) * 100}%` }}
            />
          </div>

          <button
            onClick={handleZoomIn}
            disabled={zoom >= 2}
            className="p-2 rounded bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomIn size={16} />
          </button>

          <button
            onClick={handleResetZoom}
            className="p-2 rounded bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Device-Specific Tips */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <h4 className="text-sm font-semibold text-[#d4af37] mb-2">Tips for {deviceType}:</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          {deviceType === 'mobile' ? (
            <>
              <li>• Use landscape mode for better control</li>
              <li>• Pinch to zoom the golf course</li>
              <li>• Tap and hold for power meter</li>
              <li>• Swipe to adjust aim direction</li>
            </>
          ) : deviceType === 'tablet' ? (
            <>
              <li>• Use both hands for better control</li>
              <li>• Landscape mode recommended</li>
              <li>• Touch gestures for precise aiming</li>
              <li>• Full access to all features</li>
            </>
          ) : null}
        </ul>
      </div>

      {/* Performance Mode Toggle */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Performance Mode</span>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#2a2a2a] transition-colors focus:outline-none">
            <span className="inline-block h-4 w-4 transform rounded-full bg-[#d4af37] transition-transform translate-x-1" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Reduces graphics for smoother gameplay on slower devices
        </p>
      </div>
    </div>
  );
}