/**
 * ---------------------------------------------------------------------------
 * SUBGROUPS  —  "The fyndig Group"
 * ---------------------------------------------------------------------------
 * The companies that sit under fyndig. The section reads this file and nothing
 * else: add an entry here and a card appears, remove it and the card goes.
 * With the array empty the whole section hides itself, so nothing breaks while
 * a new venture is still unannounced.
 *
 * Every optional field hides its own block when left empty — `services`,
 * `pillars`, `locations` and `href` — so a subgroup can be published the day it
 * is named and filled in later.
 * ---------------------------------------------------------------------------
 */

export type SubgroupStatus = 'Live' | 'Launching Soon' | 'In Development';

/**
 * A subgroup's own colours. fyndig's site is navy and blue; a subgroup is its
 * own company and wears its own palette, so each card is tinted from these
 * values rather than from the site theme. Taken straight from the subgroup's
 * own site so the two never drift apart.
 */
export type SubgroupBrand = {
  /** Primary brand colour — border, icons, star, button. */
  accent: string;
  /** A lighter tone of it, used for gradients and hover. */
  accentSoft: string;
  /** Card background gradient, dark end to darker end. */
  tintFrom: string;
  tintTo: string;
  /** Colour the wordmark is set in. */
  wordmark: string;
};

export type Subgroup = {
  /** Internal key — must be unique. */
  id: string;
  /** Display name. */
  name: string;
  /** Short category label shown above the title. */
  category: string;
  /** The subgroup's own tagline, shown in quotes under the name. */
  tagline: string;
  /** One or two sentences describing what it does. */
  description: string;
  /** What it offers. Empty array hides the list. */
  services: string[];
  /** The brand's own pillars — rendered as a row of chips. Empty hides it. */
  pillars: string[];
  /** Cities it operates from. Empty array hides the row. */
  locations: string[];
  /** Current stage. */
  status: SubgroupStatus;
  /** Its own colours — see SubgroupBrand. */
  brand: SubgroupBrand;
  /** Its own website, or null to hide the link. */
  href: string | null;
};

export const subgroupsIntro =
  'fyndig is building more than software. Each subgroup is a company of its own, run by the same people and held to the same standard.';

export const subgroups: Subgroup[] = [
  {
    id: 'vindalia',
    name: 'Vindalia',
    category: 'Event Management Company',
    tagline: 'Bringing ideas, people and experiences together — one event at a time.',
    description:
      'Vindalia plans and runs family events and celebrations end to end — from the first idea through to the day itself. It brings the same care fyndig puts into products to the moments people remember.',
    services: [
      'Family events and celebrations',
      'Event planning, design and on-the-day coordination',
      'Photographers and video editors arranged for clients who need them',
      'Weddings — coming soon',
    ],
    pillars: ['Plan', 'Create', 'Connect', 'Celebrate'],
    locations: ['Bengaluru', 'Tirupati'],
    status: 'Live',
    // Vindalia's own palette, lifted from vindalia.fyndig.in: marigold on dusk.
    brand: {
      accent: '#EFB45A',
      accentSoft: '#F4C271',
      tintFrom: '#232A3B',
      tintTo: '#1B2030',
      wordmark: '#F7F0E5',
    },
    href: 'https://vindalia.fyndig.in',
  },
];
