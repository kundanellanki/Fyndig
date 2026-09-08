'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects as staticProjects, projectsSection, type Project } from '@/data/projects';
import { isRemoteImage } from '@/lib/api';
import Icon from './Icon';

/**
 * ---------------------------------------------------------------------------
 * Current Projects — "What We're Building"
 * ---------------------------------------------------------------------------
 * Desktop (>=1024px): the section pins and the project rail moves HORIZONTALLY
 * as the user scrolls VERTICALLY. Only the rail is transformed — the fixed
 * forest background is not a ScrollTrigger target and never moves.
 *
 * Cards are portrait with a 16:9 media band on top, so a project image is shown
 * whole rather than cropped to a column. To make room inside one pinned screen
 * the section intro is hidden from `lg` up — it still reads on mobile.
 *
 * Mobile / tablet: portrait cards in a native touch-swipeable rail with snap
 * points, so there is no scroll hijacking on touch devices.
 *
 * Content comes from the backend when NEXT_PUBLIC_API_URL is set and reachable
 * (page.tsx does that fetch on the server); otherwise from src/data/projects.ts.
 * Editing the data file therefore still works with no backend running.
 * ---------------------------------------------------------------------------
 */
export default function CurrentProjects({ projects = staticProjects }: { projects?: Project[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section || !rail) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ----- Desktop: scroll-driven horizontal movement -----
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth + 120);

        const tween = gsap.to(rail, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance() + 80}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
              setIndex(Math.min(projects.length - 1, Math.round(self.progress * (projects.length - 1))));
            },
          },
        });

        // Card reveal as each one enters the viewport horizontally.
        gsap.utils.toArray<HTMLElement>('[data-project-card]').forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0.25, scale: 0.95, y: 24 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: 'left 88%',
                end: 'left 52%',
                scrub: true,
              },
            },
          );
        });
      });

      // ----- Mobile / reduced motion: simple reveal, native swiping -----
      mm.add('(max-width: 1023.98px)', () => {
        gsap.utils.toArray<HTMLElement>('[data-project-card]').forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
            },
          );
        });
      });

      if (reduced) {
        gsap.set('[data-project-card]', { opacity: 1, y: 0, scale: 1 });
      }
    }, section);

    return () => ctx.revert();
    // Re-measure if the number of cards changes (API content vs static fallback).
  }, [projects.length]);

  // Keep the counter honest while the user swipes on mobile.
  const onRailScroll = () => {
    const rail = railRef.current;
    if (!rail || window.innerWidth >= 1024) return;
    const card = rail.querySelector<HTMLElement>('[data-project-card]');
    if (!card) return;
    const step = card.offsetWidth + 20;
    setIndex(Math.min(projects.length - 1, Math.round(rail.scrollLeft / step)));
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="sheet relative overflow-clip py-24 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:pb-8 lg:pt-[calc(72px_+_1.25rem)]"
    >
      {/* Header */}
      <div className="shell shrink-0">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl lg:max-w-[34rem]">
            <p className="eyebrow" data-reveal="fade">
              {projectsSection.eyebrow}
            </p>
            <h2 className="h-section mt-5 lg:!text-[clamp(1.75rem,2.6vw,2.5rem)]" data-reveal="blur">
              {projectsSection.heading}
            </h2>
            <p className="lead mt-5 lg:hidden" data-reveal>
              {projectsSection.intro}
            </p>
          </div>

          <div className="flex items-center gap-4 lg:pb-2" data-reveal="fade">
            <span className="num text-sm text-white">{String(index + 1).padStart(2, '0')}</span>
            <span className="h-px w-10 bg-white/20" />
            <span className="num text-sm text-steel">{String(projects.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Rail */}
      <div className="mt-12 overflow-hidden lg:mt-7">
        <div
          ref={railRef}
          onScroll={onRailScroll}
          className="rail flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto px-[var(--shell-pad)] pb-2 lg:overflow-visible lg:px-[max(var(--shell-pad),calc((100vw_-_1240px)/2))]"
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} n={i} />
          ))}

          {/* Closing card */}
          <div
            data-project-card
            className="flex w-[min(84vw,380px)] shrink-0 snap-center items-center justify-center rounded-2xl border border-dashed border-white/12 p-8 lg:w-[300px]"
          >
            <div className="text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/12 text-steel">
                <Icon name="Sparkles" className="h-5 w-5" />
              </span>
              <p className="mt-5 font-display text-xl font-light text-white">{projectsSection.outro}</p>
              <a href="#contact" className="btn btn-ghost mt-6 h-10 px-5 text-sm">
                Start a project
                <Icon name="ArrowRight" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="shell mt-10 shrink-0 lg:mt-6">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10">
            <span
              ref={progressRef}
              className="block h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-soft"
            />
          </div>
          <span className="hidden items-center gap-2 text-[0.6875rem] uppercase tracking-[0.2em] text-steel lg:flex">
            Scroll
            <Icon name="ArrowRight" className="h-3.5 w-3.5" />
          </span>
          <span className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.2em] text-steel lg:hidden">
            Swipe
            <Icon name="ArrowRight" className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p, n }: { project: Project; n: number }) {
  const hasProblemSolution = Boolean(p.problem || p.solution);
  const isSparse = p.features.length === 0 && p.technologies.length === 0 && !hasProblemSolution;

  return (
    <article
      data-project-card
      className={[
        'card pcard group flex w-[min(84vw,380px)] shrink-0 snap-center flex-col overflow-hidden',
        // A card with nothing but a name needs less width than a detailed one.
        isSparse && !p.image ? 'lg:w-[340px]' : 'lg:w-[460px]',
      ].join(' ')}
    >
      {/* Visual */}
      <div className="pcard-vis relative aspect-[16/10] shrink-0 overflow-hidden border-b border-white/8">
        {p.image && isRemoteImage(p.image) ? (
          // A URL set in the admin panel. Plain <img> so it needs no host
          // allowlist in next.config.mjs — see safeImage() in lib/api.ts.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : p.image ? (
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 1024px) 84vw, 460px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <PlaceholderVisual seed={n} />
        )}
        <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-ink-950/85 px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-accent-soft">
          {p.status}
        </span>
      </div>

      {/* Body */}
      <div className="pcard-body flex flex-1 flex-col p-6">
        <div className="pcard-meta flex items-start justify-between gap-3">
          <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-steel">{p.category}</span>
          <span className="num text-[0.6875rem] text-steel">{String(n + 1).padStart(2, '0')}</span>
        </div>

        <h3 className="mt-3 font-display text-2xl font-normal text-white">{p.name}</h3>
        <p className="mt-3 text-[0.875rem] leading-relaxed text-mist">{p.description}</p>

        {p.features.length > 0 && (
          <div className="pcard-block mt-5 border-t border-white/8 pt-4">
            <p className="pcard-label text-[0.625rem] uppercase tracking-[0.2em] text-steel">Key features</p>
            <ul className="feature-list mt-3 text-[0.75rem] leading-[1.55] text-mist sm:columns-2 sm:gap-x-6">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {hasProblemSolution && (
          <dl className="pcard-block mt-5 space-y-3 border-t border-white/8 pt-4 text-[0.8125rem]">
            {p.problem && (
              <div>
                <dt className="text-[0.625rem] uppercase tracking-[0.2em] text-steel">Problem</dt>
                <dd className="mt-1 leading-relaxed text-mist">{p.problem}</dd>
              </div>
            )}
            {p.solution && (
              <div>
                <dt className="text-[0.625rem] uppercase tracking-[0.2em] text-steel">Solution</dt>
                <dd className="mt-1 leading-relaxed text-mist">{p.solution}</dd>
              </div>
            )}
          </dl>
        )}

        {p.technologies.length > 0 && (
          <ul className="tech-row mt-5 flex flex-wrap gap-1.5">
            {p.technologies.map((t) => (
              <li
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.6875rem] text-mist"
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        {/* A link always shows. The "details coming soon" line only appears on a
            card that has nothing else to say — the status badge covers it otherwise. */}
        {p.link ? (
          <div className="pcard-foot mt-auto pt-5">
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-accent-soft transition-colors hover:text-white"
            >
              View project
              <Icon name="ArrowUpRight" className="h-4 w-4" />
            </a>
          </div>
        ) : isSparse ? (
          <div className="pcard-foot mt-auto pt-5">
            <span className="inline-flex items-center gap-2 text-[0.875rem] text-steel">
              <Icon name="Clock" className="h-4 w-4" />
              Details coming soon
            </span>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/** Abstract placeholder used until a real project image is supplied. */
function PlaceholderVisual({ seed }: { seed: number }) {
  const rotate = [0, 18, -12, 8][seed % 4];
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-ink-700/80 via-ink-900/85 to-ink-950">
      <svg
        className="absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 400 250"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g transform={`rotate(${rotate} 200 125)`} stroke="rgba(143,187,255,0.28)" fill="none">
          <circle cx="200" cy="125" r="42" />
          <circle cx="200" cy="125" r="72" strokeDasharray="3 7" />
          <circle cx="200" cy="125" r="104" strokeDasharray="1 9" />
          <line x1="40" y1="125" x2="158" y2="125" />
          <line x1="242" y1="125" x2="360" y2="125" />
          <line x1="200" y1="20" x2="200" y2="83" />
          <line x1="200" y1="167" x2="200" y2="230" />
        </g>
        <g fill="rgba(143,187,255,0.75)">
          <circle cx="40" cy="125" r="3" />
          <circle cx="360" cy="125" r="3" />
          <circle cx="200" cy="20" r="3" />
          <circle cx="200" cy="230" r="3" />
        </g>
      </svg>
      <div className="absolute inset-0 grid place-items-center p-4">
        <span className="rounded-full border border-white/12 bg-ink-950/70 px-3 py-1.5 text-center text-[0.6875rem] uppercase tracking-[0.2em] text-steel">
          Project visual
        </span>
      </div>
    </div>
  );
}
