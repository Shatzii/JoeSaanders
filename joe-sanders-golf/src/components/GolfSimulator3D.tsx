'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ShotData } from '@/types';

interface GolfSimulator3DProps {
  onShotTaken?: (shotData: ShotData) => void;
  disabled?: boolean;
}

interface BallPosition {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export default function GolfSimulator3D({ onShotTaken, disabled }: GolfSimulator3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isAnimating, setIsAnimating] = useState(false);
  const [power, setPower] = useState(50);
  const [angle, setAngle] = useState(15);
  const [spin, setSpin] = useState(0);

  // Lightweight physics simulation
  const simulateShot = useCallback(() => {
    if (!canvasRef.current || isAnimating) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsAnimating(true);

    // Clear canvas and draw course
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw simple course background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.7, '#98FB98'); // Light green
    gradient.addColorStop(1, '#228B22'); // Forest green
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw tee box
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(50, canvas.height - 100, 20, 50);

    // Draw fairway
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height - 50, 200, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw green
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.ellipse(canvas.width - 100, canvas.height - 200, 40, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw hole
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(canvas.width - 100, canvas.height - 200, 3, 0, Math.PI * 2);
    ctx.fill();

    // Ball physics
    let ballX = 70; // Start at tee
    let ballY = canvas.height - 75;
    let velocityX = (power / 10) * Math.cos((angle * Math.PI) / 180);
    let velocityY = -(power / 10) * Math.sin((angle * Math.PI) / 180);
    const gravity = 0.3;
    const airResistance = 0.99;
    let bounceCount = 0;
    const maxBounces = 3;

    const animate = () => {
      // Clear previous ball
      ctx.clearRect(ballX - 10, ballY - 10, 20, 20);

      // Redraw course elements (simplified)
      ctx.fillStyle = '#228B22';
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height - 50, 200, 30, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#32CD32';
      ctx.beginPath();
      ctx.ellipse(canvas.width - 100, canvas.height - 200, 40, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(canvas.width - 100, canvas.height - 200, 3, 0, Math.PI * 2);
      ctx.fill();

      // Update physics
      velocityY += gravity;
      velocityX *= airResistance;
      velocityY *= airResistance;

      ballX += velocityX;
      ballY += velocityY;

      // Ground collision and bounce
      if (ballY >= canvas.height - 50) {
        ballY = canvas.height - 50;
        velocityY *= -0.6; // Bounce with energy loss
        velocityX *= 0.8;
        bounceCount++;

        if (bounceCount >= maxBounces) {
          velocityX *= 0.5; // Rolling friction
        }
      }

      // Wall collisions
      if (ballX <= 0 || ballX >= canvas.width) {
        velocityX *= -0.8;
        ballX = Math.max(0, Math.min(canvas.width, ballX));
      }

      // Draw ball
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Add shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(ballX, canvas.height - 45, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Continue animation if ball is still moving
      if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1 || ballY < canvas.height - 50) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);

        // Calculate final distance
        const distance = Math.sqrt(Math.pow(ballX - 70, 2) + Math.pow(ballY - (canvas.height - 75), 2));
        const yards = Math.round(distance / 3); // Rough conversion to yards

        // Call onShotTaken callback
        if (onShotTaken) {
          onShotTaken({
            distance: yards,
            outcome: ballX > canvas.width - 120 && ballX < canvas.width - 80 && ballY > canvas.height - 220 && ballY < canvas.height - 180 ? 'hole_in_one' : 'straight',
            club: 'driver',
            angle: angle,
            force: power / 10,
            timestamp: new Date().toISOString()
          });
        }
      }
    };

    animate();
  }, [power, angle, spin, isAnimating, onShotTaken]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (disabled) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">⛳</div>
          <h3 className="text-xl font-bold mb-2">3D Golf Simulator</h3>
          <p className="text-gray-500">🚧 Currently disabled for production build</p>
          <p className="text-sm text-gray-600 mt-2">Lightweight version coming soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-900/50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Power: {power}%
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={power}
            onChange={(e) => setPower(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={isAnimating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Launch Angle: {angle}°
          </label>
          <input
            type="range"
            min="5"
            max="45"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={isAnimating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Backspin: {spin} rpm
          </label>
          <input
            type="range"
            min="-1000"
            max="1000"
            value={spin}
            onChange={(e) => setSpin(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={isAnimating}
          />
        </div>
      </div>

      {/* Canvas */}
      <div className="relative bg-gradient-to-b from-sky-400 to-green-600 rounded-lg overflow-hidden border border-green-500">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-auto max-h-96 object-contain bg-gradient-to-b from-sky-400 to-green-600"
        />

        {/* Overlay UI */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded">
          <div className="text-sm">Power: {power}%</div>
          <div className="text-sm">Angle: {angle}°</div>
        </div>

        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="text-center text-white">
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-lg font-semibold">Shot in Progress...</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={simulateShot}
          disabled={isAnimating}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-500 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnimating ? 'Swinging...' : 'Take Shot!'}
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-400 mb-2">How to Play:</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <p>• Adjust power and launch angle with the sliders above</p>
          <p>• Click "Take Shot!" to simulate your swing</p>
          <p>• Watch the ball physics and see where it lands</p>
          <p>• Try different combinations to master your shot shaping</p>
        </div>
      </div>
    </div>
  );
}
