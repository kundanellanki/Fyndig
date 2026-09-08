# fyndig — website

Building Technology for Real-World Problems

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · GSAP + ScrollTrigger · Lucide React

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build && npm start   # production
```

Node 18.18+ (Node 20 or 22 recommended).

---

## The one rule: the background never moves

The forest photograph is painted by three `position: fixed` layers rendered by
`src/components/Background.tsx` and styled in `src/app/globals.css`:

| layer | what it does |
| --- | --- |
| `.site-bg` | the photograph — `cover` / `center` / `no-repeat` |
| `.site-bg__overlay` | a static navy grade so foreground text stays readable |
| `.site-bg__grid` | a fine technology grid texture |

These layers are **never** translated, scaled, zoomed, parallaxed or animated.
They are not GSAP or ScrollTrigger targets and carry no transition. Content
scrolls *over* a completely stationary environment.

`position: fixed` is used instead of `background-attachment: fixed` because the
latter is janky on iOS Safari and forces expensive repaints.

**Do not** add `transform`, `filter`, `perspective` or `will-change: transform`
to `<body>` or to any ancestor of `.site-bg` — any of those creates a containing
block and the background would start scrolling with the page.

---

## Editing content — you should never need to touch a component

These files are the site's content. Two of them — `projects.ts` and `jobs.ts` —
are also the fallback for the backend: when the API is connected it supplies
projects and roles instead, and these files are what render if it is not. See
[The backend](#the-backend).

| file | what lives there |
| --- | --- |
| `src/data/company.ts` | name, tagline, descriptions, mission, vision, navigation, email, phones, WhatsApp, address, working hours, **social links**, **site URL** |
| `src/data/services.ts` | What We Do, capabilities, pillars, the device→decision flow, process steps, why fyndig, future vision, contact form project types |
| `src/data/projects.ts` | the Current Projects showcase |
| `src/data/jobs.ts` | Careers — job postings |

### Adding a project

Add an entry to `projects` in `src/data/projects.ts`:

```ts
{
  id: 'cam-assist-application',        // unique key
  name: 'Cam Assist Application',
  category: 'AI-Powered CCTV Search & Security Application',
  description: 'One or two sentences.',
  features: ['Natural-language search', '…'],  // [] hides the block
  problem: '',                         // '' hides the row
  solution: '',                        // '' hides the row
  status: 'In Development',            // In Development | In Design | Research
                                       // Prototyping | Testing | Coming Soon | Live
  technologies: ['Kotlin', 'AI/ML'],   // [] hides the row
  image: '/projects/my-project.jpg',   // null → built-in abstract visual
  link: 'https://…',                   // null → hides the button
}
```

Every optional block hides itself when empty, so a project can go up with as
much or as little detail as is ready. A card that has only a name stays
portrait and narrow on desktop; a fully detailed one goes landscape (visual
left, detail right) so its whole feature list fits inside the pinned screen.

Drop project images in `public/projects/` (1600px wide, 16:9 works well — the
card crops to roughly 2:1). Adding, removing or reordering entries updates the
cards, the counter and the scroll progress bar automatically.

The pinned rail gets exactly one screen, so from `lg` up every vertical
measurement in the card is a `clamp()` against `vh` — roomy on a large display,
compact on a 13" laptop, never clipped. Verified from 1024×768 to 1920×1080. If
you add a long field to the card, re-check those sizes.

### Posting a job

With the backend connected, post roles from its admin panel at `/admin/jobs`
instead — no redeploy. What follows is the file-based route, which stays the
fallback and is what runs with no backend.

`src/data/jobs.ts` is the whole job board. While `jobs` is empty — or every
entry has `open: false` — the Careers section shows **"No open roles right
now."** with an open-application button. No placeholder listings.

To publish a role, add an object to `jobs` (the file has a ready-to-fill block
in a comment):

```ts
{
  id: 'frontend-engineer',           // also the anchor: /#frontend-engineer
  title: 'Frontend Engineer',
  department: 'Engineering',
  type: 'Full-time',                 // Full-time | Part-time | Contract
                                     // Internship | Co-founder
  location: 'Tirupati, Andhra Pradesh',
  mode: 'On-site',                   // On-site | Hybrid | Remote
  experience: '0–2 years',
  summary: 'One or two sentences.',
  responsibilities: ['…'],           // [] hides the column
  requirements: ['…'],
  niceToHave: ['…'],
  postedOn: '2026-09-08',            // renders as "Posted 8 Sep 2026"
  applyUrl: null,                    // a URL sends applicants there instead
  open: true,                        // false takes it down without deleting it
}
```

The section then renders the role as an expandable card with a counter in the
header ("2 open roles"). With the backend connected, each role carries a real
application form with CV upload; without it, applying opens a pre-filled email
to `fyndig@zohomail.in` — unless you set `applyEmail` or `applyUrl` on the role,
and `applyUrl` always wins.

Roles expand using a native `<details>` element, so they work without
JavaScript and are keyboard-accessible.

### Social links

`socials` in `src/data/company.ts` is empty on purpose — nothing is invented.
Add entries and the footer renders them:

```ts
export const socials = [{ label: 'LinkedIn', href: 'https://linkedin.com/company/…' }];
```

### Domain

No domain is hardcoded anywhere. When it is live, set `siteUrl` in
`src/data/company.ts` and add `metadataBase: new URL(siteUrl)` to the `metadata`
object in `src/app/layout.tsx`.

### Map

The Find Us panel embeds Google Maps at the exact office pin using Google's
keyless embed endpoint — **no API key and no billing account required**. Both
the pin and the *Open in Google Maps* button come from `contact` in
`src/data/company.ts`:

```ts
mapsUrl: 'https://maps.app.goo.gl/…',            // the button
coordinates: { lat: 13.618974, lng: 79.383202 }, // the embedded map
```

To move the pin, paste a new Maps link into `mapsUrl` and put its coordinates
in `coordinates`.

The styled placeholder sits *underneath* the iframe rather than being replaced
by it, so if the map is ever blocked — strict CSP, an ad blocker, no network —
the panel still reads as a designed element instead of an empty white box.
Google only serves a light map without a key, so `.site-map` in `globals.css`
inverts it into the site's palette; delete that rule for a standard light map.

---

## The backend

There is a companion API in `../fyndig-backend` — enquiries, the careers board,
job applications with CV upload, project content, an admin panel and a mail
queue. See its README for setup and deployment.

Point the site at it in `.env.local` (copy `.env.local.example`):

```
NEXT_PUBLIC_API_URL=http://localhost:4000      # dev
NEXT_PUBLIC_API_URL=https://api.fyndig.com     # production
```

**The site works whether or not that is set**, and whether or not the API is
actually up. Every call falls back to the data files, so a backend outage
degrades the site to its static content rather than blanking a page.

| | `NEXT_PUBLIC_API_URL` unset or API unreachable | API reachable |
| --- | --- | --- |
| Projects | `src/data/projects.ts` | `GET /api/projects`, revalidated every 60s |
| Careers | `src/data/jobs.ts` | `GET /api/jobs` |
| Applying | pre-filled email link | a real form with CV upload |
| Contact form | `/api/contact`, then mailto | `POST /api/contact`, then `/api/contact`, then mailto |

The fetches happen in server components (`app/page.tsx` for projects,
`Careers.tsx` for roles), so the HTML arrives complete and there is no loading
flash. The client is `src/lib/api.ts`; every function there returns `null` on
any failure, which is what makes the fallback automatic rather than something
each component has to remember.

Two things to know:

- `NEXT_PUBLIC_*` is inlined into the browser bundle at **build** time. Change
  it and rebuild. Never put a secret in it.
- The API's `CORS_ORIGINS` must list this site's origin exactly — scheme and
  host, no trailing slash — or the browser blocks the response even though the
  request succeeded.

### The contact form without a backend

It still works with zero setup:

1. The form validates in the browser.
2. It POSTs to the bundled `/api/contact` route.
3. With no mail provider configured, the route replies `{ delivered: false }`
   and the browser opens a pre-filled email to `fyndig@zohomail.in`.

To deliver from this route instead, open `src/app/api/contact/route.ts` — the
Zoho SMTP and Resend recipes are written out in comments. Add to `.env.local`:

```
SMTP_HOST=smtp.zoho.in
SMTP_PORT=465
SMTP_USER=fyndig@zohomail.in
SMTP_PASS=<app-specific password from Zoho>
CONTACT_TO=fyndig@zohomail.in
```

…then `npm install nodemailer` and uncomment the block. The UI needs no changes.

The backend is the better home for this — it stores the enquiry before trying to
send anything, so a mail failure cannot lose a lead.

---

## Brand assets

| file | used where |
| --- | --- |
| `public/fyndig-logo.png` | full stacked lockup — hero and footer |
| `public/fyndig-logo-horizontal.png` | side-by-side lockup — spare, not currently used |
| `public/fyndig-mark.png` | the icon on its own — favicon |
| `public/forest-background.jpg` | the fixed background (2200px) |
| `public/forest-background-mobile.jpg` | the same image at 1100px, for small screens |

Both logo files are the supplied artwork with the white page background made
transparent — nothing was redrawn, recoloured or restyled. Because the logo is
dark navy, it sits on a white "brand plate" (`.brand-plate`) wherever it appears
on the dark page.

The supplied lockup is stacked (mark over wordmark over *the future*), which
does not fit a 72px navigation bar, so the navbar pairs the mark on a white tile
with the wordmark set in Outfit.

`fyndig-logo-horizontal.png` is the same artwork re-laid-out side by side — the
mark and the real *fyndig* wordmark, lifted from the original file and only
repositioned. It is not used on the site, but it is there if you ever want a
wide version of the logo (email signatures, letterheads, banners).

Palette (`tailwind.config.ts`): deep navy `#0B111C`, charcoal `#070B12`, logo
navy `#1E2A3F`, logo grey `#6B7A90`, off-white `#E8EDF5`, electric blue accent
`#5B9BFF`. The forest's warm tones are used only as a background accent.

---

## Animations

`src/components/ScrollAnimations.tsx` animates anything carrying `data-reveal`:

```html
<div data-reveal>                fade + slide up (default)
<div data-reveal="left|right">   slide in
<div data-reveal="scale">        scale up
<div data-reveal="blur">         blur-to-sharp
<div data-reveal="fade">         opacity only
<div data-reveal-delay="0.15">
<div data-reveal-stagger>        stagger direct children
```

`prefers-reduced-motion: reduce` shows everything immediately and disables the
pinned horizontal rail.

**Cursor** — `src/components/Cursor.tsx` replaces the pointer with an accent dot
plus a trailing ring that opens up over anything clickable and contracts on
press. It only runs on fine pointers (touch devices keep the normal cursor), the
system cursor is hidden only *after* the component mounts, text fields keep a
real I-beam, and `prefers-reduced-motion` removes the trailing lag. Colours live
in the `.cursor-dot` / `.cursor-ring` rules at the bottom of `globals.css`;
delete the `<Cursor />` line in `page.tsx` to turn it off entirely.

**Projects rail** — on `lg` and up, `CurrentProjects.tsx` pins the section and
ScrollTrigger drives the rail horizontally from vertical scroll. Only the rail
is transformed. Below `lg` it is a native touch-swipeable rail with snap points,
so there is no scroll hijacking on touch devices.

---

## Structure

```
src/
  app/
    layout.tsx            fonts, metadata, background, structured data
    page.tsx              section order
    globals.css           design system + the fixed-background rules
    api/contact/route.ts  contact endpoint
  components/
    Background.tsx  Navbar.tsx  Hero.tsx  About.tsx  WhatWeDo.tsx
    ConnectedTechnology.tsx  CurrentProjects.tsx  Capabilities.tsx
    Process.tsx  WhyFyndig.tsx  Careers.tsx  Vision.tsx  Contact.tsx
    Location.tsx  Footer.tsx  SectionHeading.tsx  Icon.tsx
    ApplyForm.tsx  ScrollAnimations.tsx  Cursor.tsx
  lib/
    api.ts                backend client — returns null so callers fall back
  data/
    company.ts  services.ts  projects.ts  jobs.ts
public/
  fyndig-logo.png  fyndig-mark.png  forest-background.jpg
```

---

## Performance

The page holds 60fps while scrolling. The rules that keep it there — all of
them documented in the PERFORMANCE NOTES block in `globals.css`:

| rule | why |
| --- | --- |
| Exactly one `backdrop-filter` on the page (the navbar) | blurring what is behind an element re-renders that region every frame; with a fixed background, blurred panels meant re-rendering most of the viewport continuously |
| Background is two static layers, no `mask-image` | masks are expensive to composite |
| No permanent `will-change` | GSAP adds one per tween and `ScrollAnimations` clears it on complete |
| No animated transforms inside a large `<svg>` | SVG children are not composited separately, so one animated node repaints the whole drawing every frame |
| Scroll handlers never read layout | geometry is measured once per resize and cached; reads inside a scroll handler force synchronous reflow |

Measured before/after on a 1440×900 window, scrolling the full page: frames
over 33ms went from **45% to 3%**, and the 95th-percentile frame from **50ms to
17ms**.

The background photograph is upscaled from a 512px source, so it is softened
and grained deliberately — that hides the upscaling. **A higher-resolution
original would look sharper**; drop it in as `public/forest-background.jpg`
(plus a half-size `forest-background-mobile.jpg`) and nothing else needs to
change.

---

## Accessibility

Semantic landmarks, one `<h1>`, ordered headings, a skip link, visible focus
rings, `aria-expanded` on the mobile menu, `aria-current` on the active nav
link, labelled form fields with `role="alert"` errors, alt text on the logo and
`aria-hidden` on decorative SVGs, `prefers-reduced-motion` honoured throughout.

Animations use `transform` and `opacity` only. Fonts are self-hosted by
`next/font`. Project images use `next/image`. Phones and small tablets get a
half-size background file.

---

## No invented information

No clients, testimonials, awards, revenue, investors, employee counts,
statistics, results, partnerships, customer names, social accounts, project
names, job postings or achievements appear anywhere. Everything unknown is an editable
placeholder in `src/data/`.

© 2026 fyndig. All rights reserved.
