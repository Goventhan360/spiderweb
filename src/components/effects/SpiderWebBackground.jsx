import { useEffect, useRef } from 'react';
import { cn } from '@/utils/helpers';

/**
 * Interactive Spider Web background canvas effect
 */
export default function SpiderWebBackground({ className, interactive = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Web parameters
    const centerX = width / 2;
    const centerY = height / 2;
    const numRings = 10;
    const numSpokes = 16;
    const maxRadius = Math.max(width, height) * 0.8;
    
    // Colors based on theme
    const purple = 'rgba(124, 58, 237, 0.2)';
    const cyan = 'rgba(34, 211, 238, 0.15)';
    const glowPurple = 'rgba(124, 58, 237, 0.8)';
    const glowCyan = 'rgba(34, 211, 238, 0.8)';
    
    // Mouse interaction
    let mouseX = -1000;
    let mouseY = -1000;
    const interactionRadius = 150;

    // Node particles moving on the web
    const nodes = Array.from({ length: 40 }).map(() => {
      // Random starting position on a ring/spoke intersection
      const ring = Math.floor(Math.random() * numRings) + 1;
      const spoke = Math.floor(Math.random() * numSpokes);
      
      return {
        ring,
        spoke,
        angle: (spoke * Math.PI * 2) / numSpokes,
        radius: (ring / numRings) * maxRadius,
        targetRing: ring,
        targetSpoke: spoke,
        speed: 0.01 + Math.random() * 0.02,
        progress: 0,
        moving: false,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? glowPurple : glowCyan,
      };
    });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    // Initial setup
    handleResize();

    const drawWeb = () => {
      ctx.clearRect(0, 0, width, height);
      
      const cx = width / 2;
      const cy = height / 2;
      
      // Calculate dist from mouse to center for interactive pull
      const dxCenter = mouseX - cx;
      const dyCenter = mouseY - cy;
      const distCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
      
      // Draw spokes
      ctx.lineWidth = 1;
      for (let i = 0; i < numSpokes; i++) {
        const angle = (i * Math.PI * 2) / numSpokes;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        
        // Add some curve/wobble based on time and mouse
        const time = Date.now() * 0.0005;
        const wobble = Math.sin(time + i) * 10;
        
        let endX = cx + Math.cos(angle) * maxRadius;
        let endY = cy + Math.sin(angle) * maxRadius;
        
        // Mouse interaction pull
        if (distCenter < maxRadius) {
          const pullFactor = Math.max(0, 1 - distCenter / maxRadius) * 0.1;
          endX += dxCenter * pullFactor;
          endY += dyCenter * pullFactor;
        }

        ctx.lineTo(endX + wobble, endY + wobble);
        
        // Gradient for spokes
        const gradient = ctx.createLinearGradient(cx, cy, endX, endY);
        gradient.addColorStop(0, 'rgba(124, 58, 237, 0.4)');
        gradient.addColorStop(1, 'rgba(124, 58, 237, 0.0)');
        
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }
      
      // Draw rings
      for (let r = 1; r <= numRings; r++) {
        ctx.beginPath();
        const rRadius = (r / numRings) * maxRadius;
        
        for (let i = 0; i <= numSpokes; i++) {
          const angle = (i * Math.PI * 2) / numSpokes;
          
          // Add wobble
          const time = Date.now() * 0.0005;
          const wobble = Math.sin(time + r + i) * 5;
          
          let pX = cx + Math.cos(angle) * (rRadius + wobble);
          let pY = cy + Math.sin(angle) * (rRadius + wobble);
          
          // Mouse interaction (push away from mouse)
          const dxMouse = pX - mouseX;
          const dyMouse = pY - mouseY;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          
          if (distMouse < interactionRadius) {
            const pushForce = (interactionRadius - distMouse) / interactionRadius;
            pX += (dxMouse / distMouse) * pushForce * 20;
            pY += (dyMouse / distMouse) * pushForce * 20;
          }

          if (i === 0) {
            ctx.moveTo(pX, pY);
          } else {
            // Add slight sag between points for realism
            const prevAngle = ((i - 1) * Math.PI * 2) / numSpokes;
            let prevPX = cx + Math.cos(prevAngle) * (rRadius + Math.sin(time + r + i - 1) * 5);
            let prevPY = cy + Math.sin(prevAngle) * (rRadius + Math.sin(time + r + i - 1) * 5);
            
            const midX = (prevPX + pX) / 2;
            const midY = (prevPY + pY) / 2;
            
            // Sag point
            const sagX = midX + Math.cos(angle + Math.PI/2) * (rRadius * 0.05);
            const sagY = midY + Math.sin(angle + Math.PI/2) * (rRadius * 0.05);
            
            ctx.quadraticCurveTo(sagX, sagY, pX, pY);
          }
        }
        
        ctx.strokeStyle = r % 2 === 0 ? purple : cyan;
        ctx.stroke();
      }
      
      // Draw nodes (data moving through web)
      nodes.forEach(node => {
        // Move node logic
        if (!node.moving) {
          if (Math.random() < 0.02) {
            node.moving = true;
            node.progress = 0;
            // Decide to move radially or circumferentially
            if (Math.random() > 0.5) {
              node.targetRing = Math.max(1, Math.min(numRings, node.ring + (Math.random() > 0.5 ? 1 : -1)));
            } else {
              node.targetSpoke = (node.spoke + (Math.random() > 0.5 ? 1 : -1) + numSpokes) % numSpokes;
            }
          }
        } else {
          node.progress += node.speed;
          if (node.progress >= 1) {
            node.moving = false;
            node.ring = node.targetRing;
            node.spoke = node.targetSpoke;
          }
        }
        
        // Calculate position
        const currentRing = node.moving ? node.ring + (node.targetRing - node.ring) * node.progress : node.ring;
        const currentSpoke = node.moving ? node.spoke + (node.targetSpoke - node.spoke) * node.progress : node.spoke;
        
        const angle = (currentSpoke * Math.PI * 2) / numSpokes;
        const radius = (currentRing / numRings) * maxRadius;
        
        const time = Date.now() * 0.0005;
        const wobble = Math.sin(time + currentRing + currentSpoke) * 5;
        
        const x = cx + Math.cos(angle) * (radius + wobble);
        const y = cy + Math.sin(angle) * (radius + wobble);
        
        // Draw glow
        ctx.beginPath();
        ctx.arc(x, y, node.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = node.color.replace('0.8', '0.2');
        ctx.fill();
        
        // Draw core
        ctx.beginPath();
        ctx.arc(x, y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      });

      animationFrameId = window.requestAnimationFrame(drawWeb);
    };

    drawWeb();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 z-0 pointer-events-auto', className)}
      style={{ background: 'transparent' }}
    />
  );
}
