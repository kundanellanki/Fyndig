import Image from 'next/image';
import { company } from '@/data/company';
import Icon from './Icon';

/**
 * Full-screen cinematic hero.
 *
 * The forest environment behind this section is the fixed background layer — it
 * is NOT rendered here and never moves. The only things that animate are the
 * foreground node/particle decorations below, which drift independently.
 */
export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20">
      {/* Foreground technology decoration — animates independently of the
          background, which stays perfectly still. */}
      <div className="pointer-events-none absolute inset-0 -z-[1]" aria-hidden="true">
        <svg className="absolute inset-0 h-full w-full opacity-[0.5]" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="lineFade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5B9BFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#8FBBFF" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#5B9BFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g stroke="url(#lineFade)" strokeWidth="1" fill="none">
            <path d="M-50 220 L280 220 L360 300 L680 300" />
            <path d="M1250 180 L940 180 L860 260 L560 260" />
            <path d="M-50 610 L240 610 L320 540 L620 540" />
            <path d="M1250 650 L980 650 L900 570 L640 570" />
          </g>
          {/* Static dots on purpose: animating a transform on an SVG child
              repaints this full-viewport <svg> every frame. The drifting
              particles below are real composited layers and cost nothing. */}
          <g fill="#8FBBFF">
            {[
              [280, 220, 0.85],
              [680, 300, 0.55],
              [860, 260, 0.9],
              [320, 540, 0.6],
              [900, 570, 0.85],
              [240, 610, 0.5],
            ].map(([cx, cy, o], i) => (
              <circle key={i} cx={cx} cy={cy} r="3" opacity={o} />
            ))}
          </g>
        </svg>

        {/* Drifting particles */}
        {[12, 28, 44, 61, 77, 90].map((left, i) => (
          <span
            key={left}
            className="absolute bottom-[18%] h-1 w-1 rounded-full bg-accent-soft/60 animate-drift"
            style={{ left: `${left}%`, animationDelay: `${i * 2.3}s`, animationDuration: `${12 + i}s` }}
          />
        ))}
      </div>

      <div className="shell relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Brand plate — the supplied logo, unmodified, on a light surface so
              the dark navy artwork reads correctly against the dark page. */}
          <div className="mb-9 flex justify-center" data-reveal="scale">
            <div className="brand-plate inline-flex items-center justify-center px-7 py-6 sm:px-9 sm:py-7">
              <Image
                src="/fyndig-logo.png"
                alt={`${company.name} — ${company.tagline}`}
                width={533}
                height={567}
                priority
                className="h-[104px] w-auto sm:h-[128px]"
              />
            </div>
          </div>

          <p className="eyebrow justify-center" data-reveal="fade" data-reveal-delay="0.1">
            {company.eyebrow}
          </p>

          <h1 className="h-display mt-6" data-reveal="blur" data-reveal-delay="0.15">
            {company.tagline}
          </h1>

          <p className="lead mx-auto mt-7 max-w-2xl" data-reveal data-reveal-delay="0.25">
            {company.heroSupport}
          </p>

          <div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            data-reveal
            data-reveal-delay="0.35"
          >
            <a href="#what-we-do" className="btn btn-primary w-full sm:w-auto">
              Explore What We Build
              <Icon name="ArrowRight" className="h-4 w-4" />
            </a>
            <a href="#contact" className="btn btn-ghost w-full sm:w-auto">
              Let&apos;s Work Together
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center"
        aria-hidden="true"
      >
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <span className="h-1.5 w-1 rounded-full bg-white/60 animate-floatSlow" />
        </span>
      </div>
    </section>
  );
}
