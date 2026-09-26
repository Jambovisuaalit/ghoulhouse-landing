'use client';

import { useEffect, useRef } from 'react';

/**
 * A lightweight, native Next.js interpretation of the supplied Framer dot-grid
 * reference. The CSS/SVG grid remains visible without JavaScript.
 */
export default function HeroDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = canvas?.parentElement;
    const hero = wrapper?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !wrapper || !hero || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    // Static SVG fallback for touch devices and users who prefer less motion.
    if (reducedMotion.matches || !finePointer.matches) return;

    const spacing = 44;
    const impactRadius = 146;
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = 0;
    let influence = 0;
    let isHovering = false;
    let pointerX = -1000;
    let pointerY = -1000;

    const render = () => {
      context.clearRect(0, 0, width, height);
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          const dx = x - pointerX;
          const dy = y - pointerY;
          const distance = Math.hypot(dx, dy);
          const proximity = Math.max(0, 1 - distance / impactRadius);
          const strength = proximity * proximity * influence;
          const offset = strength * 9;
          const norm = distance > 0 ? distance : 1;
          const drawX = x + (dx / norm) * offset;
          const drawY = y + (dy / norm) * offset;

          context.beginPath();
          context.arc(drawX, drawY, 1.25 + 1.3 * strength, 0, Math.PI * 2);
          context.fillStyle = strength > 0.035
            ? `rgba(201, 40, 45, ${Math.min(0.55, 0.16 + strength * 0.42)})`
            : 'rgba(17, 17, 17, 0.19)';
          context.fill();
        }
      }
    };

    const requestFrame = () => {
      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    const animate = (time: number) => {
      frame = 0;
      // Cap the animation near 30 FPS. Idle state requires no animation frames.
      if (time - lastFrame < 32) {
        requestFrame();
        return;
      }
      lastFrame = time;
      influence += ((isHovering ? 1 : 0) - influence) * 0.16;
      if (!isHovering && influence < 0.008) {
        influence = 0;
        pointerX = -1000;
        pointerY = -1000;
      }
      render();
      if (isHovering || influence > 0) requestFrame();
    };

    const resize = () => {
      width = wrapper.clientWidth;
      height = wrapper.clientHeight;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
      // Swap out the static SVG only after the canvas has drawn successfully.
      wrapper.classList.add('is-enhanced');
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const bounds = wrapper.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
      isHovering = true;
      requestFrame();
    };

    const onPointerLeave = () => {
      isHovering = false;
      requestFrame();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    hero.addEventListener('pointermove', onPointerMove, { passive: true });
    hero.addEventListener('pointerleave', onPointerLeave);
    resize();

    return () => {
      observer.disconnect();
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
      wrapper.classList.remove('is-enhanced');
    };
  }, []);

  return (
    <div className="ghHeroDotGrid" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
