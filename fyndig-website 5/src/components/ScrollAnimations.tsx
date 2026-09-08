'use client';

/**
 * ---------------------------------------------------------------------------
 * ScrollAnimations — global GSAP ScrollTrigger reveals
 * ---------------------------------------------------------------------------
 * Animates every element carrying a `data-reveal` attribute as it enters the
 * viewport. FOREGROUND CONTENT ONLY.
 *
 * The fixed background layers (.site-bg, .site-bg__overlay, .site-bg__grid) are
 * never selected here and must never become ScrollTrigger targets.
 *
 * Usage:
 *   <div data-reveal>            fade + slide up (default)
 *   <div data-reveal="left">     slide in from the left
 *   <div data-reveal="right">    slide in from the right
 *   <div data-reveal="scale">    scale up
 *   <div data-reveal="blur">     blur-to-sharp
 *   <div data-reveal="fade">     opacity only
 *   <div data-reveal-delay="0.1">
 *   <div data-reveal-stagger>    stagger this element's direct children
 * ---------------------------------------------------------------------------
 */

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Variant = 'up' | 'left' | 'right' | 'scale' | 'blur' | 'fade';

const FROM: Record<Variant, gsap.TweenVars> = {
  up: { y: 34, opacity: 0 },
  left: { x: -44, opacity: 0 },
  right: { x: 44, opacity: 0 },
  scale: { scale: 0.94, opacity: 0 },
  blur: { filter: 'blur(8px)', opacity: 0, y: 16 },
  fade: { opacity: 0 },
};

const TO: Record<Variant, gsap.TweenVars> = {
  up: { y: 0, opacity: 1 },
  left: { x: 0, opacity: 1 },
  right: { x: 0, opacity: 1 },
  scale: { scale: 1, opacity: 1 },
  blur: { filter: 'blur(0px)', opacity: 1, y: 0 },
  fade: { opacity: 1 },
};

export default function ScrollAnimations() {
  useEffect(() => {
    // Respect the user's motion preference: show everything, animate nothing.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set('[data-reveal]', { opacity: 1, clearProps: 'transform,filter' });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const variant = ((el.dataset.reveal || 'up') as Variant) in FROM
          ? ((el.dataset.reveal || 'up') as Variant)
          : 'up';
        const delay = parseFloat(el.dataset.revealDelay || '0');
        const targets = el.hasAttribute('data-reveal-stagger')
          ? Array.from(el.children)
          : el;

        if (el.hasAttribute('data-reveal-stagger')) {
          gsap.set(el, { opacity: 1 });
        }

        gsap.fromTo(
          targets,
          FROM[variant],
          {
            ...TO[variant],
            duration: 0.85,
            delay,
            ease: 'power3.out',
            stagger: el.hasAttribute('data-reveal-stagger') ? 0.08 : 0,
            // Drop the transform/filter layer once the reveal is done. Leaving a
            // filter (or a promoted layer) on gradient-clipped headings keeps
            // them on a rasterised texture, which reads as soft or fringed type.
            onComplete() {
              gsap.set(this.targets(), { clearProps: 'transform,filter,willChange' });
            },
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          },
        );
      });
    });

    // Recalculate after fonts/images settle so triggers land in the right place.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const t = window.setTimeout(refresh, 600);

    return () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return null;
}
