import { useEffect, useRef } from 'react';
import { cn } from '@/utils/helpers';

/**
 * Floating particle system background effect
 */
export default function ParticleField({ 
  className, 
  count = 50, 
  color = 'rgba(124, 58, 237, 0.5)' // default primary purple
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

    // Create particles
    const particles = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      opacitySpeed: (Math.random() - 0.5) * 0.01,
    }));

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        // Move
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Pulsate opacity
        p.opacity += p.opacitySpeed;
        if (p.opacity <= 0.1 || p.opacity >= 0.8) {
          p.opacitySpeed *= -1;
        }

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[\d.]+\)$/g, `${p.opacity})`);
        ctx.fill();
        
        // Draw soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[\d.]+\)$/g, `${p.opacity * 0.3})`);
        ctx.fill();
      });

      animationFrameId = window.requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 z-0 pointer-events-none', className)}
    />
  );
}
