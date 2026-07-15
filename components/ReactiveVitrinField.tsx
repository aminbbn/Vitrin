import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeProvider';

export interface ReactiveVitrinFieldProps {
  intensity?: 'quiet' | 'normal' | 'hero';
  density?: number; // custom grid spacing multiplier
  distortionRadius?: number;
  distortionStrength?: number;
  glowRadius?: number;
  className?: string;
}

interface Point {
  ox: number; // original X
  oy: number; // original Y
  x: number;  // current X
  y: number;  // current Y
  vx: number; // velocity X
  vy: number; // velocity Y
}

export const ReactiveVitrinField: React.FC<ReactiveVitrinFieldProps> = ({
  intensity = 'normal',
  density = 1,
  distortionRadius,
  distortionStrength,
  glowRadius,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  // Pointer position refs
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const smoothMouseRef = useRef({ x: -1000, y: -1000 });
  const lastMouseRef = useRef({ x: -1000, y: -1000, time: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  // Handle visibility & intersection to pause when offscreen
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let points: Point[] = [];

    // Configuration according to intensity
    const getGridSpacing = () => {
      const w = window.innerWidth;
      let base = 52;
      if (w < 640) {
        base = 42; // Mobile: 38-46px
      } else if (w < 1024) {
        base = 48; // Tablet: 44-52px
      } else {
        base = 54; // Desktop: 48-58px
      }
      return base * density;
    };

    let gridSpacing = getGridSpacing();

    // Physics parameters based on intensity
    const influenceRadius = distortionRadius || (intensity === 'hero' ? 220 : intensity === 'quiet' ? 175 : 200);
    const maxDisplacement = distortionStrength || (intensity === 'hero' ? 8 : intensity === 'quiet' ? 4 : 6);
    const springStiffness = intensity === 'hero' ? 0.08 : intensity === 'quiet' ? 0.12 : 0.09;
    const springDamping = intensity === 'hero' ? 0.82 : intensity === 'quiet' ? 0.86 : 0.84;
    const baseGlowRadius = glowRadius || (intensity === 'hero' ? 320 : intensity === 'quiet' ? 240 : 280);

    // Grid Initialization
    const initGrid = (width: number, height: number) => {
      points = [];
      const cols = Math.ceil(width / gridSpacing) + 2;
      const rows = Math.ceil(height / gridSpacing) + 2;

      const xOffset = (width % gridSpacing) / 2 - gridSpacing;
      const yOffset = (height % gridSpacing) / 2 - gridSpacing;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = c * gridSpacing + xOffset;
          const oy = r * gridSpacing + yOffset;
          points.push({
            ox,
            oy,
            x: ox,
            y: oy,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        
        // devicePixelRatio capped at 2 for performance
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
        gridSpacing = getGridSpacing();
        initGrid(width, height);
      }
    });

    resizeObserver.observe(container);

    // Pointer events on window to capture smoothly
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const now = performance.now();
      const dt = now - lastMouseRef.current.time;

      if (dt > 0 && lastMouseRef.current.x !== -1000) {
        const dx = currentX - lastMouseRef.current.x;
        const dy = currentY - lastMouseRef.current.y;
        // Dampen velocity to avoid extreme jumps
        velocityRef.current = {
          x: (dx / dt) * 12,
          y: (dy / dt) * 12,
        };
      }

      mouseRef.current = {
        x: currentX,
        y: currentY,
        active: true,
      };

      lastMouseRef.current = { x: currentX, y: currentY, time: now };

      if (smoothMouseRef.current.x === -1000) {
        smoothMouseRef.current = { x: currentX, y: currentY };
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Intersection observer to pause off-screen
    const io = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0.01 });
    io.observe(container);

    // Handle document hidden state to pause
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Main animation tick
    const tick = () => {
      if (!isVisibleRef.current) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const smoothMouse = smoothMouseRef.current;

      // 1. Smooth the cursor using dampening to sit slightly behind the real cursor
      if (mouse.active) {
        smoothMouse.x += (mouse.x - smoothMouse.x) * 0.12;
        smoothMouse.y += (mouse.y - smoothMouse.y) * 0.12;
      } else {
        // Slowly drift away if inactive
        smoothMouse.x += (-1000 - smoothMouse.x) * 0.08;
        smoothMouse.y += (-1000 - smoothMouse.y) * 0.08;
        velocityRef.current.x *= 0.9;
        velocityRef.current.y *= 0.9;
      }

      // Decay velocity gently
      velocityRef.current.x *= 0.94;
      velocityRef.current.y *= 0.94;

      const velX = velocityRef.current.x;
      const velY = velocityRef.current.y;
      const velMag = Math.sqrt(velX * velX + velY * velY);

      // 2. Render Soft Teal Glow (underneath the grid)
      const isMouseInBounds = smoothMouse.x > -500 && smoothMouse.y > -500;
      if (isMouseInBounds) {
        ctx.save();
        
        // Dynamic ellipse wake based on velocity
        const angle = Math.atan2(velY, velX);
        const stretch = Math.min(1 + velMag * 0.02, 1.35);
        const glowRad = baseGlowRadius;

        ctx.translate(smoothMouse.x, smoothMouse.y);
        ctx.rotate(angle);
        ctx.scale(stretch, 1 / stretch);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRad);
        
        // Exact light/dark mode glow parameters specified
        if (isDark) {
          grad.addColorStop(0, 'rgba(25, 199, 140, 0.075)');
          grad.addColorStop(0.5, 'rgba(25, 199, 140, 0.02)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          grad.addColorStop(0, 'rgba(16, 185, 129, 0.045)');
          grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.012)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, glowRad, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }

      // 3. Update points physics & displacement
      points.forEach((p) => {
        let targetX = p.ox;
        let targetY = p.oy;

        if (isMouseInBounds) {
          const dx = p.ox - smoothMouse.x;
          const dy = p.oy - smoothMouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < influenceRadius) {
            // Smooth falloff formula: Math.pow(Math.max(0, 1 - distance / radius), 2.2)
            const influence = Math.pow(Math.max(0, 1 - dist / influenceRadius), 2.2);
            // Elastic displacement away from cursor (distributing outwards)
            const factor = influence * maxDisplacement;
            
            // Connected lines stretch naturally with safe boundaries
            const angle = Math.atan2(dy, dx);
            targetX = p.ox + Math.cos(angle) * factor;
            targetY = p.oy + Math.sin(angle) * factor;
          }
        }

        // Spring system return
        const ax = (targetX - p.x) * springStiffness;
        const ay = (targetY - p.y) * springStiffness;

        p.vx = (p.vx + ax) * springDamping;
        p.vy = (p.vy + ay) * springDamping;

        p.x += p.vx;
        p.y += p.vy;
      });

      // 4. Render Grid Lines connecting nodes
      const colsCount = Math.ceil(width / gridSpacing) + 2;
      const rowsCount = points.length / colsCount;

      ctx.beginPath();
      // Line specs: extremely thin grid lines with extremely low line opacity (~0.5px)
      ctx.lineWidth = 0.5;
      
      if (isDark) {
        ctx.strokeStyle = 'rgba(45, 212, 157, 0.035)'; // Dark mode line color
      } else {
        ctx.strokeStyle = 'rgba(5, 150, 105, 0.035)'; // Light mode line color
      }

      for (let r = 0; r < rowsCount; r++) {
        for (let c = 0; c < colsCount - 1; c++) {
          const idx = r * colsCount + c;
          const p1 = points[idx];
          const p2 = points[idx + 1];
          if (p1 && p2) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }

      for (let c = 0; c < colsCount; c++) {
        for (let r = 0; r < rowsCount - 1; r++) {
          const idx = r * colsCount + c;
          const nextIdx = (r + 1) * colsCount + c;
          const p1 = points[idx];
          const p2 = points[nextIdx];
          if (p1 && p2) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.stroke();

      // 5. Render Intersections with theme-aware nodes
      points.forEach((p) => {
        let nodeAlpha = isDark ? 0.15 : 0.13;
        let nodeRadius = 0.9; // rest radius

        if (isMouseInBounds) {
          const dx = p.x - smoothMouse.x;
          const dy = p.y - smoothMouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < influenceRadius) {
            const factor = 1 - dist / influenceRadius;
            nodeRadius = 0.9 + factor * 1.1; // maximum 1.8-2.2px
            nodeAlpha = isDark ? (0.15 + factor * 0.12) : (0.13 + factor * 0.10);
          }
        }

        ctx.fillStyle = isDark 
          ? `rgba(45, 212, 157, ${nodeAlpha})` // Dark node
          : `rgba(5, 150, 105, ${nodeAlpha})`; // Light node

        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intensity, density, distortionRadius, distortionStrength, glowRadius, isDark]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />
    </div>
  );
};
