/**
 * ---------------------------------------------------------------------------
 * COMPANY DATA — single source of truth
 * ---------------------------------------------------------------------------
 * Everything about the company lives here. Edit this file to update the site.
 * No component contains hardcoded company copy.
 * ---------------------------------------------------------------------------
 */

export const company = {
  name: 'fyndig',
  legalName: 'fyndig',
  tagline: 'Building Technology for Real-World Problems',
  eyebrow: 'SOFTWARE • IoT • AUTOMATION • SMART PRODUCTS',
  type: 'Technology Startup / Software & IoT Company / Digital Product Company',
  founded: '2026',

  heroSupport:
    'We build innovative software, IoT-integrated applications, and smart products that connect the physical and digital worlds.',

  shortDescription: [
    'We are a technology startup developing innovative software, IoT-integrated applications, and smart products that solve real-world problems.',
    'We combine software, IoT, automation, and modern technology to build smart, scalable, and user-focused solutions for businesses and everyday life.',
  ],

  fullDescription: [
    'We are a technology-driven startup focused on building innovative software solutions, IoT-integrated applications, and smart technology products that solve real-world problems and make everyday operations more connected, efficient, and intelligent.',
    'We combine software development, IoT, automation, cloud technologies, and modern user experiences to create scalable solutions for businesses and consumers.',
    'From custom web and mobile applications to connected devices and intelligent IoT ecosystems, we transform ideas into practical, reliable, and future-ready products.',
  ],

  mission: "To create accessible and useful technology that improves people's lives.",

  vision: [
    'Our vision is to build technology that connects the physical and digital worlds and creates meaningful solutions for the future.',
    'We aim to turn innovative ideas into products and platforms that are simple to use, scalable, and impactful.',
  ],

  approach: {
    statement: 'We believe great technology starts with understanding a real problem.',
    chain: [
      'Idea',
      'Requirement Analysis',
      'Research & Planning',
      'UI/UX Design',
      'Development',
      'IoT Integration',
      'Testing & Optimization',
      'Deployment',
      'Support & Improvement',
    ],
    closing:
      "We don't just build software or devices — we build connected solutions that make technology smarter, simpler, and more useful.",
  },
} as const;

/** Contact + location details. */
export const contact = {
  email: 'fyndig@zohomail.in',
  phones: ['+91 63015 72034', '+91 7416 476 715', '+91 8519 922 895'],
  whatsapp: ['+91 63015 72034', '+91 7416 476 715', '+91 8519 922 895'],
  primaryPhone: '+91 63015 72034',
  workingHours: 'Monday – Friday, 10:00 AM – 6:00 PM',
  /**
   * The exact pin. `mapsUrl` is the Google Maps link for the office; the
   * coordinates come from that same link and drive the embedded map.
   */
  mapsUrl: 'https://maps.app.goo.gl/o7FRdWv7ZXQmcfWWA',
  coordinates: { lat: 13.618974, lng: 79.383202 },
  address: {
    line1: '3-2-20, Vidhya Nagar Colony',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    postalCode: '517502',
    country: 'India',
    /** Short form used in the footer. */
    short: 'Tirupati, Andhra Pradesh, India',
    /** Full single-line form, used for the Google Maps search link. */
    full: '3-2-20, Vidhya Nagar Colony, Tirupati, Andhra Pradesh – 517502, India',
  },
} as const;

/**
 * Social media accounts are intentionally EMPTY.
 * Add entries here when the accounts exist — the footer renders them automatically.
 * Example: { label: 'LinkedIn', href: 'https://linkedin.com/company/...' }
 */
export const socials: { label: string; href: string }[] = [];

/**
 * The public site URL. No domain is hardcoded.
 *
 * Set NEXT_PUBLIC_SITE_URL at build time and metadata, canonical URLs and the
 * sitemap resolve against it — so moving from a temporary hosting URL to the
 * real domain is a build setting, not a code change. Left empty, the site still
 * builds and works; only absolute metadata URLs are omitted.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/+$/, '');

/** Primary navigation. `href` values map to section ids in the page. */
export const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'What We Do', href: '#what-we-do' },
  { label: 'Projects', href: '#projects' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Process', href: '#process' },
  { label: 'Careers', href: '#careers' },
  { label: 'Contact', href: '#contact' },
] as const;

/** Helpers used across components. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
export const waHref = (phone: string) => `https://wa.me/${phone.replace(/[^\d]/g, '')}`;
export const mapsHref = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

/**
 * Embeddable map for the exact pin. Uses Google's keyless embed endpoint, so
 * there is no API key to manage and no billing account required.
 */
export const mapEmbedHref = (lat: number, lng: number, zoom = 16) =>
  `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=en&output=embed`;
