import { useEffect, useRef } from 'react';
import { cn } from '@/utils/helpers';

/**
 * Animated network connection lines effect
 */
export default function NetworkLines({ 
  className, 
  density = 30, // Number of points
  connectionDistance = 150, // Max distance to draw a line
  speed = 0.5,
  color = '124, 58, 237' // RGB for primary
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Create points
    const points = Array.from({ length: density }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * 2 + 1
    }));

    const handleResize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing to parent container

    const drawNetwork = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update positions and draw points
      points.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off walls
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;

        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.5)`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            // Opacity based on distance
            const opacity = 1 - (distance / connectionDistance);
            
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = `rgba(${color}, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = window.requestAnimationFrame(drawNetwork);
    };

    drawNetwork();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [density, connectionDistance, speed, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 z-0 pointer-events-none w-full h-full', className)}
    />
  );
}
