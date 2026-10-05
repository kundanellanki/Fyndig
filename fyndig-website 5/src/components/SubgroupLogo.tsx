import type { ReactElement } from 'react';

/**
 * SubgroupLogo — each subgroup's wordmark, drawn rather than imported.
 *
 * These marks are text-led, so building them in code keeps them crisp at any
 * size, lets them take their colour from the brand tokens in
 * src/data/subgroups.ts, and means no image file to ship or keep in sync with
 * the subgroup's own site. The wordmark is real text, so it is still readable
 * to search engines and screen readers.
 *
 * Add a mark by writing a component here and keying it by the subgroup's `id`.
 * A subgroup with no entry falls back to its name set in the site's own
 * display face — correct, just not branded.
 */

/**
 * Campus: the mortarboard-and-tassel mark from campus.fyndig.in, redrawn here
 * from the same path data so the two stay identical, beside a Lexend wordmark.
 */
function CampusMark() {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        viewBox="0 0 48 48"
        className="h-[1.3rem] w-[1.3rem] shrink-0"
        style={{ color: 'var(--brand)' }}
        aria-hidden="true"
        focusable="false"
      >
        <path d="M24 7 2 17l22 10 22-10z" fill="currentColor" />
        <path
          d="M10 22v10c0 4 6.3 7 14 7s14-3 14-7V22l-14 6.4z"
          fill="currentColor"
          opacity=".85"
        />
        <path d="M42 18.6V31" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="42" cy="32.5" r="2.4" fill="currentColor" />
      </svg>
      <span
        className="font-lexend text-[1.3rem] font-semibold leading-none tracking-[-0.015em]"
        style={{ color: 'var(--wordmark)' }}
      >
        Campus
      </span>
    </span>
  );
}

/** Vindalia: ivory Cormorant wordmark with a raised marigold four-point star. */
function VindaliaMark() {
  return (
    <span className="inline-flex items-start gap-1">
      <span
        className="font-serif text-[1.5rem] font-medium leading-none tracking-[0.01em]"
        style={{ color: 'var(--wordmark)' }}
      >
        <span className="text-[1.18em]">V</span>indalia
      </span>
      <svg
        viewBox="-1 -1 2 2"
        className="h-[0.45rem] w-[0.45rem] shrink-0"
        style={{ color: 'var(--brand)' }}
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M0-1C.1-.45.45-.1 1 0 .45.1.1.45 0 1-.1.45-.45.1-1 0-.45-.1-.1-.45 0-1z"
        />
      </svg>
    </span>
  );
}

const registry: Record<string, () => ReactElement> = {
  campus: CampusMark,
  vindalia: VindaliaMark,
};

export default function SubgroupLogo({ id, name }: { id: string; name: string }) {
  const Mark = registry[id];
  if (!Mark) {
    return <span className="font-display text-xl font-normal text-white">{name}</span>;
  }
  return <Mark />;
}
