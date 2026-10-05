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
