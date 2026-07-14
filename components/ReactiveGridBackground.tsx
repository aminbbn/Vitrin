import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

export interface ReactiveGridBackgroundProps {
  density?: number; // Distance between grid lines (defaults to 50px)
  distortionRadius?: number; // Radius of mouse distortion (defaults to 180px)
  distortionStrength?: number; // Strength of displacement (defaults to 7px)
  glowRadius?: number; // Soft gradient hover glow size (defaults to 260px)
  className?: string;
  intensity?: 'subtle' | 'normal' | 'showcase';
}

export const ReactiveGridBackground: React.FC<ReactiveGridBackgroundProps> = ({
  density = 50,
  distortionRadius = 180,
  distortionStrength = 7,
  glowRadius = 260,
  className = '',
  intensity = 'normal',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isDark } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  // Anim state stored in refs to bypass React re-renders on mousemove
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false, speed: 0 });
  const lastMousePos = useRef({ x: -1000, y: -1000, time: 0 });
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Grid point interface
    interface GridPoint {
      x: number; // Current x
      y: number; // Current y
      ox: number; // Original x
      oy: number; // Original y
      vx: number; // Velocity x
      vy: number; // Velocity y
    }

    let points: GridPoint[] = [];

    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
      width = rect.width;
      height = rect.height;

      // Cap DPR to 2 for performance
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      initGrid();
    };

    const initGrid = () => {
      points = [];
      const cols = Math.ceil(width / density) + 1;
      const rows = Math.ceil(height / density) + 1;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * density;
          const y = r * density;
          points.push({
            x,
            y,
            ox: x,
            oy: y,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    // Responsive sizing
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    resize();

    // Intersection observer to pause offscreen
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      intersectionObserver.observe(containerRef.current);
    }

    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Mouse listeners
    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchDevice || shouldReduceMotion) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
      mouseRef.current.active = true;

      // Calculate speed
      const now = performance.now();
      const dt = now - lastMousePos.current.time;
      if (dt > 0) {
        const dx = x - lastMousePos.current.x;
        const dy = y - lastMousePos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        mouseRef.current.speed = Math.min(dist / dt, 5); // cap speed factor
      }

      lastMousePos.current.x = x;
      lastMousePos.current.y = y;
      lastMousePos.current.time = now;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    // Animation Loop
    const draw = () => {
      if (!isVisibleRef.current || document.hidden) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      
      // Interpolate mouse coordinates (spring-smoothed)
      const easeSpeed = 0.12;
      if (mouse.active) {
        if (mouse.x === -1000) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * easeSpeed;
          mouse.y += (mouse.targetY - mouse.y) * easeSpeed;
        }
      } else {
        mouse.x += (-1000 - mouse.x) * easeSpeed;
        mouse.y += (-1000 - mouse.y) * easeSpeed;
      }

      // Draw Cursor Glow
      if (mouse.active && !isTouchDevice && !shouldReduceMotion) {
        // Base teal color based on dark/light mode
        const glowColor = isDark ? 'rgba(25, 199, 140, ' : 'rgba(16, 185, 129, ';
        const multiplier = intensity === 'subtle' ? 0.45 : intensity === 'showcase' ? 1.5 : 1.0;
        
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, glowRadius * (1 + mouse.speed * 0.15)
        );

        gradient.addColorStop(0, `${glowColor}${0.09 * multiplier})`);
        gradient.addColorStop(0.35, `${glowColor}${0.035 * multiplier})`);
        gradient.addColorStop(0.72, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius * (1 + mouse.speed * 0.15) * 1.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (isTouchDevice && !shouldReduceMotion) {
        // Soft ambient drifting glow for mobile/touch
        const t = performance.now() * 0.001;
        const cx = width * (0.5 + Math.sin(t * 0.5) * 0.2);
        const cy = height * (0.5 + Math.cos(t * 0.4) * 0.2);
        const glowColor = isDark ? 'rgba(25, 199, 140, ' : 'rgba(16, 185, 129, ';
        const multiplier = intensity === 'subtle' ? 0.3 : 0.6;
        
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius * 1.5);
        gradient.addColorStop(0, `${glowColor}${0.05 * multiplier})`);
        gradient.addColorStop(0.5, `${glowColor}${0.01 * multiplier})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, glowRadius * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Physics Settings
      const springStiffness = 0.05;
      const springDamping = 0.82;

      // Update Point Physics
      points.forEach((pt) => {
        if (!shouldReduceMotion) {
          const dx = mouse.x - pt.ox;
          const dy = mouse.y - pt.oy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < distortionRadius && mouse.active) {
            const influence = Math.pow(Math.max(0, 1 - dist / distortionRadius), 2);
            // Displace away from mouse
            const forceX = (dx / dist) * -distortionStrength * influence;
            const forceY = (dy / dist) * -distortionStrength * influence;

            // Apply displacement force directly with spring tension
            const ax = (pt.ox + forceX - pt.x) * springStiffness;
            const ay = (pt.oy + forceY - pt.y) * springStiffness;

            pt.vx = (pt.vx + ax) * springDamping;
            pt.vy = (pt.vy + ay) * springDamping;
          } else {
            // Standard spring back to origin
            const ax = (pt.ox - pt.x) * springStiffness;
            const ay = (pt.oy - pt.y) * springStiffness;

            pt.vx = (pt.vx + ax) * springDamping;
            pt.vy = (pt.vy + ay) * springDamping;
          }
        }

        pt.x += pt.vx;
        pt.y += pt.vy;
      });

      // Drawing Configuration
      const lineAlpha = isDark
        ? intensity === 'subtle' ? 0.015 : intensity === 'showcase' ? 0.06 : 0.03
        : intensity === 'subtle' ? 0.015 : intensity === 'showcase' ? 0.05 : 0.025;

      ctx.strokeStyle = isDark
        ? `rgba(255, 255, 255, ${lineAlpha})`
        : `rgba(17, 31, 24, ${lineAlpha})`;

      ctx.lineWidth = 0.55;

      // Draw horizontal & vertical connections
      const cols = Math.ceil(width / density) + 1;
      const rows = Math.ceil(height / density) + 1;

      // Draw vertical lines
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const idx = c * rows + r;
          if (idx < points.length) {
            const pt = points[idx];
            if (r === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const idx = c * rows + r;
          if (idx < points.length) {
            const pt = points[idx];
            if (c === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
      }

      // Draw Grid Crossing Nodes
      points.forEach((pt) => {
        const dx = mouse.x - pt.x;
        const dy = mouse.y - pt.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let nodeRadius = 0.85;
        let nodeAlpha = isDark ? 0.12 : 0.09;

        if (dist < distortionRadius && mouse.active && !shouldReduceMotion) {
          const factor = 1 - dist / distortionRadius;
          nodeRadius += factor * 1.15;
          nodeAlpha += factor * 0.32;
        }

        ctx.fillStyle = isDark
          ? `rgba(25, 199, 140, ${nodeAlpha})`
          : `rgba(16, 185, 129, ${nodeAlpha})`;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [density, distortionRadius, distortionStrength, glowRadius, isDark, shouldReduceMotion, intensity]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
