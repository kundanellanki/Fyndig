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

/** Vindalia: ivory Cormorant wordmark with a raised marigold four-point star. */
function VindaliaMark() {
  return (
    <span className="inline-flex items-start gap-1.5">
      <span
        className="font-serif text-[2rem] font-medium leading-none tracking-[0.01em]"
        style={{ color: 'var(--wordmark)' }}
      >
        <span className="text-[1.18em]">V</span>indalia
      </span>
      <svg
        viewBox="-1 -1 2 2"
        className="h-[0.6rem] w-[0.6rem] shrink-0"
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
  vindalia: VindaliaMark,
};

export default function SubgroupLogo({ id, name }: { id: string; name: string }) {
  const Mark = registry[id];
  if (!Mark) {
    return <span className="font-display text-2xl font-normal text-white">{name}</span>;
  }
  return <Mark />;
}
