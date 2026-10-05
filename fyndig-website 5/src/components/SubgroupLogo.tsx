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
 * MansonsForge and Flotel are picture marks drawn for their own backgrounds —
 * one light, one dark — so each is shown as its own small tile rather than
 * recoloured to sit on this card. Both are optimised PNGs under 2 kB.
 */
const MANSONSFORGE_MARK =
  'data:image/png;base64,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';

const FLOTEL_MARK =
  'data:image/png;base64,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';

function MansonsForgeMark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={MANSONSFORGE_MARK} alt="" width={128} height={128} className="h-7 w-7 shrink-0" />
      <span
        className="font-display text-[1.25rem] font-semibold leading-none tracking-[-0.01em]"
        style={{ color: 'var(--wordmark)' }}
      >
        Mansons<span style={{ color: 'var(--brand)' }}>Forge</span>
      </span>
    </span>
  );
}

function FlotelMark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FLOTEL_MARK} alt="" width={128} height={128} className="h-7 w-7 shrink-0" />
      <span
        className="font-display text-[1.25rem] font-semibold leading-none tracking-[-0.01em]"
        style={{ color: 'var(--wordmark)' }}
      >
        Flotel
      </span>
    </span>
  );
}

/**
 * The Trip: its real picture mark — the plane, sun, palm and pin from
 * thetrip.fyndig.in — inlined as a small optimised PNG rather than drawn,
 * because it is an illustration and not a glyph. 2.5 kB, so it costs less
 * than the request an external file would need.
 */
const TRIP_MARK =
  'data:image/png;base64,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';

function TheTripMark() {
  return (
    <span className="inline-flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={TRIP_MARK} alt="" width={137} height={128} className="h-[1.6rem] w-auto shrink-0" />
      <span
        className="font-jakarta text-[1.25rem] font-bold leading-none tracking-[-0.02em]"
        style={{ color: 'var(--wordmark)' }}
      >
        The Trip
      </span>
    </span>
  );
}

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
  flotel: FlotelMark,
  mansonsforge: MansonsForgeMark,
  thetrip: TheTripMark,
  vindalia: VindaliaMark,
};

export default function SubgroupLogo({ id, name }: { id: string; name: string }) {
  const Mark = registry[id];
  if (!Mark) {
    return <span className="font-display text-xl font-normal text-white">{name}</span>;
  }
  return <Mark />;
}
