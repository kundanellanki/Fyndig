'use client';

/**
 * ---------------------------------------------------------------------------
 * Cursor — themed pointer
 * ---------------------------------------------------------------------------
 * A small accent dot that tracks the pointer exactly, plus a ring that trails
 * it with easing. The ring expands over anything clickable, contracts on press,
 * and both fade out when the pointer leaves the window.
 *
 * Deliberate constraints:
 *  - Fine pointers only. Touch and coarse pointers get the normal cursor and
 *    this component renders nothing.
 *  - `prefers-reduced-motion: reduce` removes the trailing lag; the ring simply
 *    follows the dot.
 *  - The native cursor is only hidden AFTER this mounts (it sets
 *    `data-cursor="on"` on <html>), so with JavaScript off nothing is lost.
 *  - Text fields keep a real I-beam and the custom cursor hides over them,
 *    because a decorative cursor should never cost you a usable one.
 *  - Two `position: fixed` layers with no scroll listener — the fixed
 *    background is untouched.
 * ---------------------------------------------------------------------------
 */

import { useEffect, useRef } from 'react';

const CLICKABLE = 'a, button, summary, [role="button"], label[for]';
const TEXT_FIELD = 'input, textarea';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Touch / stylus / anything without a hoverable fine pointer: do nothing.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    root.setAttribute('data-cursor', 'on');

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let visible = false;
    let frame = 0;

    const render = () => {
      // Ease the ring toward the pointer; 1 = no lag (reduced motion).
      const ease = reduced ? 1 : 0.18;
      rx += (x - rx) * ease;
      ry += (y - ry) * ease;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    const show = () => {
      if (visible) return;
      visible = true;
      dot.classList.add('is-active');
      ring.classList.add('is-active');
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        // Jump the ring into place the first time so it does not fly in.
        rx = x;
        ry = y;
        show();
      }

      const el = e.target as Element | null;
      const overText = Boolean(el?.closest?.(TEXT_FIELD));
      const overClickable = !overText && Boolean(el?.closest?.(CLICKABLE));

      ring.classList.toggle('is-link', overClickable);
      dot.classList.toggle('is-link', overClickable);
      ring.classList.toggle('is-hidden', overText);
      dot.classList.toggle('is-hidden', overText);
    };

    const onLeave = () => {
      visible = false;
      dot.classList.remove('is-active');
      ring.classList.remove('is-active');
    };

    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      root.removeAttribute('data-cursor');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
